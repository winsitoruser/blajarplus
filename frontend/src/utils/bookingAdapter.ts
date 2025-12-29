/**
 * Booking Data Adapter
 * Transforms backend booking data to frontend format
 */

export interface BackendBooking {
  id: string;
  studentId: string;
  tutorId: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  status: string;
  cancelReason?: string;
  cancelledBy?: string;
  totalAmount: number;
  notes?: string;
  meetingLink?: string;
  locationAddress?: string;
  locationType?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  tutor?: {
    id: string;
    userId: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl?: string;
    };
  };
  tutorSubject?: {
    subject: {
      id: string;
      name: string;
    };
  };
}

export interface FrontendBooking {
  id: string;
  bookingNumber: string;
  status: string;
  subject: {
    id?: string;
    name: string;
  };
  duration: number;
  scheduledAt: string;
  totalAmount: number;
  tutor: {
    user: {
      fullName: string;
      avatarUrl?: string | null;
    };
  };
  student: {
    fullName: string;
    avatarUrl?: string | null;
  };
  teachingMethod: string;
  meetingLink?: string | null;
  location?: string;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: string;
  createdAt: string;
  completedAt?: string;
  rescheduleReason?: string;
}

/**
 * Transform backend booking data to frontend format
 */
export const transformBackendBooking = (backendBooking: BackendBooking): FrontendBooking => {
  // Generate booking number from ID
  const bookingNumber = `BKG-${new Date(backendBooking.createdAt).getFullYear()}-${backendBooking.id.slice(0, 6).toUpperCase()}`;

  // Convert duration from minutes to hours
  const duration = backendBooking.durationMinutes / 60;

  // Determine teaching method from location type
  const teachingMethod = backendBooking.locationType === 'online' ? 'online' : 'offline';

  // Get subject name from relation
  const subjectName = backendBooking.tutorSubject?.subject?.name || 'Unknown Subject';
  const subjectId = backendBooking.tutorSubject?.subject?.id;

  // Calculate completed time (if status is completed)
  const completedAt = backendBooking.status === 'completed' 
    ? backendBooking.endAt 
    : undefined;

  return {
    id: backendBooking.id,
    bookingNumber,
    status: backendBooking.status,
    subject: {
      id: subjectId,
      name: subjectName,
    },
    duration,
    scheduledAt: backendBooking.startAt,
    totalAmount: Number(backendBooking.totalAmount),
    tutor: {
      user: {
        fullName: backendBooking.tutor?.user?.fullName || 'Unknown Tutor',
        avatarUrl: backendBooking.tutor?.user?.avatarUrl || null,
      },
    },
    student: {
      fullName: backendBooking.student?.fullName || 'Unknown Student',
      avatarUrl: backendBooking.student?.avatarUrl || null,
    },
    teachingMethod,
    meetingLink: backendBooking.meetingLink || null,
    location: backendBooking.locationAddress,
    notes: backendBooking.notes,
    cancelReason: backendBooking.cancelReason,
    cancelledBy: backendBooking.cancelledBy,
    createdAt: backendBooking.createdAt,
    completedAt,
  };
};

/**
 * Transform array of backend bookings to frontend format
 */
export const transformBackendBookings = (backendBookings: BackendBooking[]): FrontendBooking[] => {
  return backendBookings.map(transformBackendBooking);
};

/**
 * Transform frontend booking data to backend format for create/update
 */
export const transformFrontendBookingToBackend = (frontendData: any) => {
  return {
    tutorId: frontendData.tutorId,
    subjectId: frontendData.subjectId,
    startAt: frontendData.scheduledAt || frontendData.date,
    durationMinutes: (frontendData.duration || 1) * 60, // Convert hours to minutes
    locationType: frontendData.teachingMethod === 'online' ? 'online' : 'student_place',
    locationAddress: frontendData.location,
    meetingLink: frontendData.meetingLink,
    notes: frontendData.notes,
  };
};
