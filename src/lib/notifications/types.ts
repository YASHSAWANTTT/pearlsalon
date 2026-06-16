export type AppointmentInfo = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceName: string;
  scheduledAtIso: string;
};

export type QueueInfo = {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  position: number;
};
