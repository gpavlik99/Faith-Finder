import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Church } from '@/types/church';
import { toast } from 'sonner';

// Fetch all churches
export function useChurches(filters?: {
  denomination?: string;
  size?: string;
  location?: string;
}) {
  return useQuery({
    queryKey: ['churches', filters],
    queryFn: async () => {
      let query = supabase
        .from('churches')
        .select('*')
        .order('name');

      if (filters?.denomination && filters.denomination !== 'no-preference') {
        query = query.eq('denomination', filters.denomination);
      }
      if (filters?.size) {
        query = query.eq('size', filters.size);
      }
      if (filters?.location && filters.location !== 'Centre County') {
        query = query.eq('location', filters.location);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching churches:', error);
        throw new Error('Failed to load churches');
      }
      
      return (data || []) as Church[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single church
export function useChurch(id: string | undefined) {
  return useQuery({
    queryKey: ['church', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error('Failed to load church');
      return data as Church;
    },
    enabled: !!id,
  });
}

// Church matching
export function useChurchMatch() {
  return useMutation({
    mutationFn: async (searchParams: any) => {
      const { data, error } = await supabase.functions.invoke('match-church', {
        body: searchParams,
      });

      if (error) throw new Error('Failed to find matches');
      return data;
    },
    onSuccess: (data) => {
      toast.success('Found your church matches!');
    },
    onError: (error: Error) => {
      toast.error('Search failed', {
        description: error.message,
      });
    },
  });
}

// Add church (admin)
export function useAddChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (church: Omit<Church, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('churches')
        .insert([church])
        .select()
        .single();

      if (error) throw new Error('Failed to add church');
      return data as Church;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
      toast.success('Church added successfully!');
    },
    onError: () => {
      toast.error('Failed to add church');
    },
  });
}

// Update church (admin)
export function useUpdateChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Church> }) => {
      const { data, error } = await supabase
        .from('churches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error('Failed to update church');
      return data as Church;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
      queryClient.invalidateQueries({ queryKey: ['church', data.id] });
      toast.success('Church updated!');
    },
    onError: () => {
      toast.error('Failed to update church');
    },
  });
}

// Delete church (admin)
export function useDeleteChurch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('churches')
        .delete()
        .eq('id', id);

      if (error) throw new Error('Failed to delete church');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
      toast.success('Church deleted');
    },
    onError: () => {
      toast.error('Failed to delete church');
    },
  });
}
