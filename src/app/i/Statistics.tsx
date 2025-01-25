'use client'

import Loader from "@/components/ui/Loader"
import { useProfile } from "@/hooks/useProfile"

export function Statistics() {
	const {data, isLoading} = useProfile()
	
	return isLoading 
		? <Loader/> 
		: (
			<div className='grid grid-cols-4 gap-12 mt-7'>				
				{
					data?.statistics.length 
					? (
							data.statistics.map(st=>(
								<div 
									className='bg-border/5 rounded p-layout text-center hover:-translate-y-3 transition-transform duration-500'
									key={st.label}
								>
									<div className='text-xl'>{st.label}</div>
									<div className='text-3xl font-semibold'>{st.value}</div>
								</div>
							))							
						)
					: <div>Statistics not found </div>
				}
			</div>
		)
}