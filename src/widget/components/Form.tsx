import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSlots, bookSlot, failBooking } from '../services/mockServer.ts';
import Calendar from './Calendar.tsx';
import Loader from './Loader.tsx';


interface formData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const Form = () => {
  const { register, handleSubmit, reset, formState: {errors} } = useForm<formData>();
  const [ selectedDate, setSelectedDate ] = useState<Date | null>(new Date());
  const [ loading, setLoading ] = useState(false);

  const onSubmit = async (_data: formData) => {
    try {
      const slots = await getSlots();

      const chosenSlot = slots.find(slot => {
        const slotDate = new Date(slot.date);
        return (
          slotDate.getUTCFullYear() === selectedDate?.getFullYear() &&
          slotDate.getUTCMonth() === selectedDate?.getMonth() &&
          slotDate.getUTCDate() === selectedDate?.getDate()
        );
      });

      if (!chosenSlot)
        return toast.error('Veuillez sélectionner un créneau.');
      if (chosenSlot.id === 6) {
        setLoading(true);
        await failBooking(chosenSlot.id);
        setLoading(false);
        return toast.error('Échec de paiement. Veuillez réessayer plus tard.');
      }

      const slotBooked = await bookSlot(chosenSlot.id);
      if (!slotBooked)
        toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
      else
        toast.success('Votre réservation est confirmée.');
      reset();
    } catch {
      console.error('An error occured', errors);
      toast.error('Créneau complet. Merci d\'en choisir un autre.');
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="mb-4">
          <label htmlFor="firstName" className="custom-form-label">Prénom</label>
          <input {...register("firstName", { required: "Ce champ est requis" })} id="firstName" type="text" className="custom-form-input" />
          {errors.firstName && <p className="custom-form-errors">{ errors.firstName.message }</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="custom-form-label">Nom</label>
          <input {...register("lastName", { required: "Ce champ est requis" })} id="lastName" type="text" className="custom-form-input" />
          {errors.lastName && <p className="custom-form-errors">{ errors.lastName.message }</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="custom-form-label">Email</label>
          <input {...register("email", {required: "Ce champ est requis", pattern: {value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Adresse mail invalide"}})} id="email" type="email" className="custom-form-input" />
          {errors.email && <p className="custom-form-errors">{ errors.email.message }</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="custom-form-label">Téléphone</label>
          <input {...register("phoneNumber", {required: "Ce champ est requis", pattern: {value: /\d{10}$/, message: "Numéro invalide"}})} id="phoneNumber" type="phoneNumber" className="custom-form-input" />
          {errors.phoneNumber && <p className="custom-form-errors">{ errors.phoneNumber.message }</p>}
        </div>

        <div className="inline text-left items-center gap-3 mt-4 text-sm">
          <p className="text-sm mt-4 ml-2 text-black">
            <span className="text-[#FB5151] font-bold">Rappel</span> : les ateliers ont lieu de 18h à 20h. Les réservations <b>ne sont plus possible après 17h30</b> le jour même.</p>
        </div>

        <div className="mt-8">
          <div className="flex-shrink-0">
            <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-12 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#74c69d] rounded-sm"></span>
              <p className="m-0 text-black">Disponible</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ffbd71] rounded-sm"></span>
              <p className="m-0 text-black">Places limitées</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#fb5151] rounded-sm"></span>
              <p className="m-0 text-black">Complet</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#bde0fe] rounded-sm"></span>
              <p className="m-0 text-black">Vacances / fériés</p>
            </div>
          </div>
        </div>

        <div className="flex items-center ml-12 mt-8 space-x-4">
          <button type="submit" className="bg-[#6c757d] hover:bg-[#bdc6d1] text-[#FAF8E6] font-bolf py-2 px-4 rounded-mdi cursor-pointer">Réserver</button>
        { loading && <Loader loading={true} /> }
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Form;
