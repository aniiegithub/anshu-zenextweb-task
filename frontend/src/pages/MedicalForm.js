import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    height: '',
    weight: '',
    nationality: 'Indian',
    dateOfIssue: '',
    placeOfIssue: '',
    passportNo: '',
    gender: '',
    maritalStatus: '',
    visionRight: '',
    visionLeft: '',
    earRight: '',
    earLeft: '',
    bloodPressure: '',
    heartRate: '',
    lungs: '',
    abdomen: '',
    hydrocele: '',
    vdrl: '',
    chestXray: '',
    pregnancy: '',
    remarks: '',
    urineSugar: '',
    urineAlbumin: '',
    urineOthers: '',
    haemoglobin: '',
    malariaRapid: '',
    microfilaria: '',
    bloodGroup: '',
    stoolSalmonella: '',
    stoolBilharziasis: '',
    stoolHelminths: '',
    stoolCholera: '',
    hbsag: '',
    antiHcv: '',
    hiv: '',
    urea: '',
    creatinine: '',
    bloodUrea: '',
    kft: '',
    fitStatus: 'FIT',
  });

  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to handle date changes and store as yyyy-mm-dd string
  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? date.toISOString().split('T')[0] : '',
    }));
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Medical Examination Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormStep>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['fullName', 'age', 'postAppliedFor', 'height', 'weight', 'nationality', 'placeOfIssue', 'passportNo'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={field === 'age' || field === 'height' || field === 'weight' ? 'number' : 'text'}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* DOB DatePicker */}
            <div>
              <label htmlFor="dob" className="block font-semibold mb-2 capitalize">
                Date Of Birth
              </label>
              <DatePicker
                selected={formData.dob ? new Date(formData.dob) : null}
                onChange={(date) => handleDateChange('dob', date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date of Birth"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="dob"
                name="dob"
              />
            </div>

            {/* Date Of Issue DatePicker */}
            <div>
              <label htmlFor="dateOfIssue" className="block font-semibold mb-2 capitalize">
                Date Of Issue
              </label>
              <DatePicker
                selected={formData.dateOfIssue ? new Date(formData.dateOfIssue) : null}
                onChange={(date) => handleDateChange('dateOfIssue', date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date of Issue"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="dateOfIssue"
                name="dateOfIssue"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block font-semibold mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="maritalStatus" className="block font-semibold mb-2">
                Marital Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'visionRight',
              'visionLeft',
              'earRight',
              'earLeft',
              'bloodPressure',
              'heartRate',
              'lungs',
              'abdomen',
              'hydrocele',
              'vdrl',
              'chestXray',
              'pregnancy',
              'remarks',
            ].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </FormStep>

        <FormStep>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'urineSugar',
              'urineAlbumin',
              'urineOthers',
              'haemoglobin',
              'malariaRapid',
              'microfilaria',
              'bloodGroup',
              'stoolSalmonella',
              'stoolBilharziasis',
              'stoolHelminths',
              'stoolCholera',
              'hbsag',
              'antiHcv',
              'hiv',
              'urea',
              'creatinine',
              'bloodUrea',
              'kft',
            ].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </FormStep>

        <FormStep>
          <label htmlFor="fitStatus" className="block font-semibold mb-2">
            FIT Status
          </label>
          <select
            id="fitStatus"
            name="fitStatus"
            value={formData.fitStatus}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
