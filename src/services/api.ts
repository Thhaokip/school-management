
import { Student, Accountant, AcademicSession, Class, FeeHead, FeePayment, SchoolProfile } from "@/types";

// Configure your API URL based on environment - Updated for XAMPP
// Make sure this path matches where you placed the project in htdocs
const API_URL = 'http://localhost/school-management/src/api';

// Generic function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to get error message from response
    try {
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      } else {
        // If not JSON, get the text and use it in the error
        const errorText = await response.text();
        console.error('Non-JSON error response:', errorText);
        throw new Error(`API request failed: Server returned a non-JSON response`);
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        // JSON parse error
        console.error('Error parsing JSON response');
        throw new Error(`API request failed: Invalid JSON response from server`);
      }
      throw e; // Re-throw the error from the JSON handling
    }
  }
  
  // Check if the response is JSON before trying to parse it
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Response is not JSON:', await response.text());
    throw new Error('API request failed: Server returned a non-JSON response');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
  
  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/users.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'changePassword',
        userId,
        currentPassword,
        newPassword
      }),
    });
    return handleResponse(response);
  }
};

// Students API
export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    const response = await fetch(`${API_URL}/students.php`);
    return handleResponse(response);
  },

  create: async (student: Omit<Student, 'id'>): Promise<Student> => {
    const response = await fetch(`${API_URL}/students.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    return handleResponse(response);
  },

  update: async (student: Student): Promise<void> => {
    const response = await fetch(`${API_URL}/students.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    return handleResponse(response);
  },
};

// Accountants API
export const accountantsAPI = {
  getAll: async (): Promise<Accountant[]> => {
    const response = await fetch(`${API_URL}/accountants.php`);
    return handleResponse(response);
  },

  create: async (accountant: Omit<Accountant, 'id'>): Promise<Accountant> => {
    const response = await fetch(`${API_URL}/accountants.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountant),
    });
    return handleResponse(response);
  },

  update: async (accountant: Accountant): Promise<void> => {
    const response = await fetch(`${API_URL}/accountants.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountant),
    });
    return handleResponse(response);
  },
};

// Academic Sessions API
export const academicSessionsAPI = {
  getAll: async (): Promise<AcademicSession[]> => {
    const response = await fetch(`${API_URL}/academic-sessions.php`);
    return handleResponse(response);
  },

  create: async (session: Omit<AcademicSession, 'id'>): Promise<{ id: string; message: string }> => {
    const response = await fetch(`${API_URL}/academic-sessions.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    return handleResponse(response);
  },

  update: async (session: AcademicSession): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/academic-sessions.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/academic-sessions.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },
};

// Classes API
export const classesAPI = {
  getAll: async (): Promise<Class[]> => {
    const response = await fetch(`${API_URL}/classes.php`);
    return handleResponse(response);
  },

  create: async (classItem: Omit<Class, 'id' | 'createdAt'>): Promise<{ id: string; message: string }> => {
    const response = await fetch(`${API_URL}/classes.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classItem),
    });
    return handleResponse(response);
  },

  update: async (classItem: Class): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/classes.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classItem),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/classes.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },
};

// Fee Heads API
export const feeHeadsAPI = {
  getAll: async (): Promise<FeeHead[]> => {
    const response = await fetch(`${API_URL}/fee-heads.php`);
    return handleResponse(response);
  },

  create: async (feeHead: Omit<FeeHead, 'id' | 'createdAt'>): Promise<FeeHead> => {
    const response = await fetch(`${API_URL}/fee-heads.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feeHead),
    });
    return handleResponse(response);
  },

  update: async (feeHead: FeeHead): Promise<void> => {
    const response = await fetch(`${API_URL}/fee-heads.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feeHead),
    });
    return handleResponse(response);
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async (): Promise<FeePayment[]> => {
    const response = await fetch(`${API_URL}/payments.php`);
    return handleResponse(response);
  },

  create: async (payment: Omit<FeePayment, 'id' | 'paidDate' | 'receiptNumber' | 'status'>): Promise<{
    payment: FeePayment;
    message: string;
  }> => {
    const response = await fetch(`${API_URL}/payments.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });
    return handleResponse(response);
  },
};

// School Profile API
export const schoolProfileAPI = {
  get: async (): Promise<SchoolProfile> => {
    try {
      const response = await fetch(`${API_URL}/school-profile.php`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching school profile:', error);
      throw error;
    }
  },

  save: async (profile: SchoolProfile): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_URL}/school-profile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving school profile:', error);
      throw error;
    }
  },
};
