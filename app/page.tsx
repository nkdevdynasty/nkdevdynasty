'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Page() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('users_')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    testConnection()
  }, [])

  return <div>Check Console</div>
}
