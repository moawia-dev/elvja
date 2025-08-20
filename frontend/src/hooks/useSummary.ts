import { useQuery } from '@tanstack/react-query'; 
import { http } from '../lib/http'; 
export function useSummary(){return useQuery({queryKey:['summary'],queryFn:async()=> (await http.get('/reports/summary')).data});}
