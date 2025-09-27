// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'management' | 'country_lead' | 'ambassador' | 'support';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Dashboard and KPI Types
export interface KpiData {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
}

// Table and Data Types
export interface TableColumn<T = any> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableData {
  [key: string]: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormData {
  [key: string]: any;
}

// Ambassador Types
export interface Ambassador {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  school?: string;
  location: string;
  country_code: string;
  status: 'active' | 'inactive' | 'pending';
  join_date: string;
  last_activity: string;
  performance_score?: number;
  leads_generated: number;
  tasks_completed: number;
  badges_earned: number;
}

export interface AmbassadorActivity {
  id: string;
  ambassador_id: string;
  activity_type: 'school_visit' | 'lead_generated' | 'task_completed' | 'report_submitted';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// School Types
export interface School {
  id: string;
  name: string;
  location: string;
  country_code: string;
  type: 'primary' | 'secondary' | 'tertiary';
  status: 'prospect' | 'contacted' | 'visited' | 'partnered' | 'inactive';
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  student_count?: number;
  partnership_date?: string;
  last_visit?: string;
  notes?: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee_id: string;
  assignee_name: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  created_at: string;
  updated_at: string;
  progress?: number;
  school_id?: string;
  school_name?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: 'school_visit' | 'workshop' | 'webinar' | 'meeting' | 'other';
  start_date: string;
  end_date: string;
  location?: string;
  organizer_id: string;
  organizer_name: string;
  attendees?: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  max_attendees?: number;
  registration_deadline?: string;
}

// Report Types
export interface Report {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  generated_by: string;
  generated_at: string;
  date_range: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  status: 'generating' | 'completed' | 'failed';
  download_url?: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
  action_label?: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Country and Location Types
export interface Country {
  code: string;
  name: string;
  flag_url: string;
  lead_id?: string;
  active_ambassadors: number;
  total_schools: number;
  partnered_schools: number;
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard_layout: Record<string, any>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  user_id?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Filter and Search Types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchFilters {
  query?: string;
  status?: string[];
  priority?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  assignee?: string[];
  [key: string]: any;
}

// Chart and Visualization Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: any;
    y?: any;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Keys>> }[Keys];

// API Hook Types
export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToastOnError?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

// Escalation Types
export interface Escalation {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
  category: 'scholarship' | 'compliance' | 'technical' | 'ambassador' | 'partner' | 'system' | 'finance';
  sub_category?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  impact: 'single_student' | 'multiple_students' | 'regional' | 'national' | 'system_wide';
  reporter_id: string;
  assignee_id?: string;
  school_id?: string;
  task_id?: string;
  team_id?: string;
  due_date?: string;
  resolved_at?: string;
  closed_at?: string;
  resolution_notes?: string;
  time_to_resolve?: number;
  attachments?: string[];
  tags?: string[];
  watchers?: string[];
  customer_satisfaction?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  users?: {
    full_name: string;
    email: string;
    country_code?: string;
  };
  schools?: {
    name: string;
    location: string;
    country_code: string;
  };
  teams?: {
    name: string;
  };
}

export interface EscalationStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

export interface EscalationComment {
  id: string;
  escalation_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface EscalationActivity {
  id: string;
  type: 'escalation_created' | 'escalation_assigned' | 'escalation_resolved' | 'escalation_commented' | 'escalation_updated';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  escalation_id: string;
  metadata?: Record<string, any>;
}
