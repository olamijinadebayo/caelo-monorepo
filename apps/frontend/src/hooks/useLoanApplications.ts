import { useState, useEffect, useCallback } from 'react';
import { LoanApplication } from '../lib/types';
import { loanApplicationService } from '../services/loanApplications';
import { useToast } from './use-toast';

export const useLoanApplications = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loanApplicationService.getLoanApplications();
      setApplications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load loan applications';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateApplicationStatus = useCallback(async (id: string, status: string) => {
    try {
      const updatedApplication = await loanApplicationService.updateApplicationStatus(id, status);
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app));
      toast({
        title: "Success",
        description: "Application status updated successfully.",
      });
      return updatedApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const addApplicationNote = useCallback(async (id: string, note: string) => {
    try {
      const updatedApplication = await loanApplicationService.addApplicationNote(id, note);
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app));
      toast({
        title: "Success",
        description: "Note added successfully.",
      });
      return updatedApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const getApplicationById = useCallback((id: string) => {
    return applications.find(app => app.id === id);
  }, [applications]);

  const filterApplicationsByStatus = useCallback((status: string) => {
    return applications.filter(app => app.status === status);
  }, [applications]);

  const searchApplications = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return applications;
    
    return applications.filter(app => 
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loanApplicationService.getLoanApplications();
        if (isMounted) setApplications(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load loan applications';
        if (isMounted) setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [toast]);

  return {
    applications,
    isLoading,
    error,
    loadApplications,
    updateApplicationStatus,
    addApplicationNote,
    getApplicationById,
    filterApplicationsByStatus,
    searchApplications,
  };
}; 