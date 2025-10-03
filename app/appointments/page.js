"use client"
import React from 'react'
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import { Calendar, Clock, Mail, CheckCircle2, Trash2, AlertCircle } from 'lucide-react'

const Page = () => {
    const { data: session, status } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userEmail = session?.user?.email || "";

    useEffect(() => {
        if (status !== 'authenticated') return;
        (async () => {
          try {
            setLoading(true);
            const res = await fetch('/api/appointments/sync', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) {
              setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
            } else {
              console.error('Failed to load appointments', data);
            }
          } catch (e) {
            console.error('Error loading appointments', e);
          } finally {
            setLoading(false);
          }
        })();
    }, [status])
    
    const handleComplete = async (appointmentId) => {
      try {
        const res = await fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' });
        if (res.ok) {
          setAppointments((prev) => prev.filter((x) => x._id !== appointmentId));
        }
      } catch (_) {}
    }

    const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
        case 'confirmed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      }
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Appointments</h1>
                <p className="text-slate-400">Manage your upcoming consultations</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          {!loading && appointments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Total Appointments</p>
                    <p className="text-3xl font-bold text-white">{appointments.length}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-blue-400 opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">This Week</p>
                    <p className="text-3xl font-bold text-white">
                      {appointments.filter(a => {
                        const start = new Date(a.startTime);
                        const now = new Date();
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return start >= now && start <= weekFromNow;
                      }).length}
                    </p>
                  </div>
                  <Clock className="w-10 h-10 text-emerald-400 opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Confirmed</p>
                    <p className="text-3xl font-bold text-white">
                      {appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-purple-400 opacity-50" />
                </div>
              </div>
            </div>
          )}

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl p-12 text-center backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4 border border-slate-700/50">
                <AlertCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Appointments Found</h3>
              <p className="text-slate-400">You don't have any scheduled appointments at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((a, index) => (
                <div 
                  key={a.calendlyEventUri}
                  className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      {/* Event URI */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                          <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-400 mb-1">Event Reference</p>
                          <p className="text-white font-medium break-all text-sm">{a.calendlyEventUri}</p>
                        </div>
                      </div>

                      {/* Time Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                            <Clock className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Start Time</p>
                            <p className="text-white font-medium">
                              {a.startTime ? new Date(a.startTime).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : '-'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                            <Clock className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 mb-1">End Time</p>
                            <p className="text-white font-medium">
                              {a.endTime ? new Date(a.endTime).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Patient & Status */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400">Patient:</span>
                          <span className="text-white font-medium">{a.patientEmail || '-'}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(a.status)}`}>
                          {a.status || 'Pending'}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="lg:pl-6 lg:border-l lg:border-slate-700/50">
                      <button
                        onClick={() => handleComplete(a._id)}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    )
}

export default Page