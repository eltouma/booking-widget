import React from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiCalendar } from "react-icons/ci";
import getSlot from '../services/mockServer.ts';
import Calendar from './Calendar.tsx';

const Form = () => {
  const {register, handleSubmit, reset, formState: {errors}} = useForm();

  const onSubmit = async (data) => {
    try {
      const slot = await getSlot();
      console.log('Slot:', slot);
      toast.success('Votre réservation est confirmée');
    } catch(error) {
      console.error("Une erreur est survenue", error);
      toast.error('Une erreur est survenue. Merci de réessayer plus tard');
    }
  }

  return (
    <div className="max-w-[400px] w-full bg-white p-6 rounded-md shadow-md">

      <div className="flex items-center mb-8">
        <div className="flex right-5 top-5 text-[#FAF8E6] bg-[#F85441] p-2 rounded-full cursor-pointer transition-all mr-2">
          <CiCalendar />
        </div>
        <h1 className="text-4xl font-bold uppercase text-[#7C0080]">Réservations</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="firstName" className="block">Prénom</label>
          <input {...register("firstName", {required: "Ce champ est requis"})} id="firstName" type="text" className="outline-none form-input mt-1 block w-full border-b border-b-gray-300 mb-1" />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block">Nom</label>
          <input {...register("lastName", {required: "Ce champ est requis"})} id="lastName" type="text" className="outline-none form-input mt-1 block w-full border-b border-b-gray-300i mb-1" />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input {...register("email", {required: "Ce champ est requis", pattern: {value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Adresse mail invalide"}})} id="email" type="email" className="outline-none form-input mt-1 block w-full border-b border-b-gray-300 mb-1" />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block">Téléphone</label>
          <input {...register("phoneNumber", {required: "Ce champ est requis", pattern: {value: /\d{10}$/, message: "Numéro invalide"}})} id="phoneNumber" type="phoneNumber" className="outline-none form-input mt-1 block w-full border-b border-b-gray-300 mb-1" />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
        </div>
        <div className="mt-4">
          <Calendar />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-[#F85441] hover:bg-[#F96539] text-[#FAF8E6] font-bolf py-2 px-4 rounded-md">Réserver</button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Form
