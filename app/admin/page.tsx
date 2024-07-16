import StatCard from '@/components/StatCard'
import {columns} from '@/components/tables/columns'
import {DataTable} from '@/components/tables/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

   
const Admin = async() => {
    const appointment = await getRecentAppointmentList();
    console.log(appointment);

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
        <Link className='cursor-pointer' href="/">
            <Image
                src='/assets/icons/logo-full.svg'
                alt='logo'
                width={32}
                height={162}
                className='h-8 w-fit'
            />
        </Link>
            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>

        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <h1 className='header'> Welcome 👋</h1>
                <p className='text-dark-700'>Manage your patients and appointments</p>
            </section>

            <section className='admin-stat'>
                <StatCard 
                  type="appointments"
                  count={appointment.scheduledCount}
                  label="Schedule appointments"
                  icon="/assets/icons/appointments.svg"
                />
                <StatCard 
                  type="pending"
                  count={appointment.pendingCount}
                  label="Pending appointments"
                  icon="/assets/icons/pending.svg"
                />
                <StatCard 
                  type="cancelled"
                  count={appointment.cancelledCount}
                  label="Cancelled appointments"
                  icon="/assets/icons/cancelled.svg"
                />
            </section>

            <DataTable columns={columns} data={appointment.documents}/>

        </main>
    </div>
  )
}

export default Admin
