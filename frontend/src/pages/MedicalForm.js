import React, { useState } from 'react';
import { submitReport } from '../utils/api';
import FormStep from '../components/FormStep';
import ImageUpload from '../components/ImageUpload';
import QRDownload from '../components/QRDownload';

const MedicalForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dob: '',
    postAppliedFor: '',
    gender: '',
    maritalStatus: '',
    fitStatus: 'FIT',
  });

  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (image) data.append('passportImage', image);

    try {
      const res = await submitReport(data);
      const pdfPath = res?.data?.pdfUrl;
      if (typeof pdfPath === 'string') {
        setPdfUrl(`http://localhost:5000${pdfPath.startsWith('/') ? '' : '/'}${pdfPath}`);
      } else {
        setError('Invalid response from server: PDF URL missing');
      }
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('submitReport error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Medical Examination Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <FormStep>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="fullName" className="block font-semibold mb-2">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="age" className="block font-semibold mb-2">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="dob" className="block font-semibold mb-2">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </FormStep>

        <FormStep>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="postAppliedFor" className="block font-semibold mb-2">Post Applied For</label>
              <input
                id="postAppliedFor"
                name="postAppliedFor"
                value={formData.postAppliedFor}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block font-semibold mb-2">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="maritalStatus" className="block font-semibold mb-2">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
                <option>Others</option>
              </select>
            </div>
          </div>
        </FormStep>

        <FormStep>
          <label className="block font-semibold mb-2">Passport Image</label>
          <ImageUpload image={image} setImage={setImage} />
        </FormStep>

        <FormStep>
          <label htmlFor="fitStatus" className="block font-semibold mb-2">FIT Status</label>
          <select
            id="fitStatus"
            name="fitStatus"
            value={formData.fitStatus}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="FIT">FIT</option>
            <option value="UNFIT">UNFIT</option>
          </select>
        </FormStep>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
      {pdfUrl && (
        <div className="mt-6 flex justify-center">
          <QRDownload pdfUrl={pdfUrl} />
        </div>
      )}
    </div>
  );
};

export default MedicalForm;
