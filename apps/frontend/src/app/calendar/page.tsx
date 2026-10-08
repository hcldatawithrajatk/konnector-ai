'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Video,
  CheckCircle2,
  CalendarCheck,
  Plus,
  Building,
} from 'lucide-react';

export default function CalendarPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      title: 'GreenField Campus Tour - Vance Family',
      attendeeName: 'Robert Vance',
      attendeePhone: '+1 (555) 987-1234',
      attendeeEmail: 'robert.vance@example.com',
      startTime: 'Saturday, Oct 17, 2026 • 10:00 AM',
      provider: 'Google Meet',
      status: 'CONFIRMED',
      notes: 'Interested in Grade 6 Cambridge curriculum. 2 adults, 1 child attending.',
    },
    {
      id: 'apt-2',
      title: 'IB DP Academic Counseling - Dr. Emily Watson',
      attendeeName: 'Dr. Emily Watson',
      attendeePhone: '+1 (555) 432-8765',
      attendeeEmail: 'emily.watson@hospital.org',
      startTime: 'Monday, Oct 19, 2026 • 2:30 PM',
      provider: 'In-Person Campus',
      status: 'CONFIRMED',
      notes: 'Scholarship eligibility assessment for Grade 11 daughter.',
    },
    {
      id: 'apt-3',
      title: 'Pre-School Facility Walkthrough - Carlos Mendoza',
      attendeeName: 'Carlos Mendoza',
      attendeePhone: '+1 (555) 789-3210',
      attendeeEmail: 'carlos.m@construct.io',
      startTime: 'Wednesday, Oct 21, 2026 • 11:15 AM',
      provider: 'In-Person Campus',
      status: 'PENDING_REMINDER',
      notes: 'Robotics club and transport bus inquiry.',
    },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Autonomous Booking Coordinator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments & Calendars</h1>
          <p className="text-xs text-slate-500 mt-1">
            Appointments scheduled by your AI Employee on WhatsApp synced with Google Calendar.
          </p>
        </div>

        {/* Integration Status Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Calendar Synced</span>
          </span>
        </div>
      </div>

      {/* Grid: Calendar Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upcoming Appointments List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Scheduled Sessions ({appointments.length})
          </h3>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{apt.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span className="font-medium text-slate-800">{apt.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{apt.attendeeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-mono">{apt.attendeePhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-slate-400" />
                    <span>{apt.provider}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>AI Notes:</strong> {apt.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Working Hours & Booking Rules */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Working Hours & Rules</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Monday - Friday</span>
                <span className="font-semibold text-slate-900">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Saturday</span>
                <span className="font-semibold text-slate-900">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Sunday</span>
                <span className="text-slate-400 font-semibold">Closed</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Meeting Duration</span>
                <span className="font-semibold text-brand-600">45 Minutes</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Buffer Time</span>
                <span className="font-semibold text-slate-900">15 Minutes</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your AI employee checks these slots before offering tour or consultation options to parents on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
