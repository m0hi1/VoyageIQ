import React, { useState, useContext, useEffect} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../../utils/config'
import useFetch from '../../hooks/useFetch';
import UpdateToursComp from './UpdateTourComp'

const UpdateTours = () => {
  const { id } = useParams();
  // Corrected URL to fetch a single tour by ID
  const { apiData: tour, error, loading } = useFetch(`${BASE_URL}/tours/${id}`);

  return (
    <div className="min-h-screen md:min-h-[400px] flex items-center justify-center bg-gray-100">
      <UpdateToursComp tour={tour} id={id} />
    </div>
  );
};

export default UpdateTours;
