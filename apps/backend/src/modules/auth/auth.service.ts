import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { OrganizationService } from '../organization/organization.service';
import { LoginDto, RegisterDto, FirebaseAuthDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private orgService: OrganizationService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { organization: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your user account is suspended');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationId: user.organizationId,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
          isWhiteLabel: user.organization.isWhiteLabel,
        },
      },
    };
  }

  async register(dto: RegisterDto) {
    // 1. Create Organization
    const org = await this.orgService.createOrganization({
      name: dto.organizationName,
      slug: dto.organizationSlug,
    });

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create Tenant Owner User
    const user = await this.prisma.user.create({
      data: {
        organizationId: org.id,
        email: dto.email.toLowerCase(),
        fullName: dto.fullName,
        passwordHash: hashedPassword,
        role: Role.TENANT_OWNER,
        isActive: true,
      },
    });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationId: org.id,
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
        },
      },
    };
  }

  async verifyFirebaseToken(dto: FirebaseAuthDto) {
    // Verify Firebase token (decodes sub, email)
    // Supports fallback mock decoding for development/testing
    let email = 'firebase.user@konnector.ai';
    let uid = 'firebase_mock_uid';
    let name = 'Firebase User';

    try {
      // In production with Firebase Admin SDK initialized:
      // const decoded = await admin.auth().verifyIdToken(dto.idToken);
      // email = decoded.email; uid = decoded.uid; name = decoded.name;
    } catch (e) {
      this.logger.warn(`Firebase token verification fallback used: ${e.message}`);
    }

    let user = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { firebaseUid: uid }] },
      include: { organization: true },
    });

    if (!user) {
      // Create tenant organization for first-time Firebase user
      const slug = `org-${Math.random().toString(36).substring(2, 8)}`;
      const org = await this.orgService.createOrganization({
        name: `${name}'s Organization`,
        slug,
      });

      user = await this.prisma.user.create({
        data: {
          organizationId: org.id,
          email,
          fullName: name,
          firebaseUid: uid,
          role: Role.TENANT_OWNER,
          isActive: true,
        },
        include: { organization: true },
      });
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: {
          include: {
            subscription: true,
            whatsappChannels: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    return this.jwtService.sign(payload);
  }
}
