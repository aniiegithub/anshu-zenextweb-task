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
    fitStatus: 'FIT'
  });
  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (image) data.append('passportImage', image);

    const res = await submitReport(data);
    setPdfUrl(`http://localhost:5000${res.data.pdfUrl.startsWith('/') ? '' : '/'}${res.data.pdfUrl}`);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Medical Examination Form</h1>
      <form onSubmit={handleSubmit}>
        <FormStep>
          <label>Full Name</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} className="border p-1 w-full" />
          <label>Age</label>
          <input name="age" value={formData.age} onChange={handleChange} className="border p-1 w-full" />
          <label>Date of Birth</label>
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="border p-1 w-full" />
        </FormStep>

        <FormStep>
          <label>Post Applied For</label>
          <input name="postAppliedFor" value={formData.postAppliedFor} onChange={handleChange} className="border p-1 w-full" />
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="border p-1 w-full">
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <label>Marital Status</label>
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="border p-1 w-full">
            <option>Single</option><option>Married</option><option>Others</option>
          </select>
        </FormStep>

        <FormStep>
          <label>Passport Image</label>
          <ImageUpload image={image} setImage={setImage} />
        </FormStep>

        <FormStep>
          <label>FIT Status</label>
          <select name="fitStatus" value={formData.fitStatus} onChange={handleChange} className="border p-1 w-full">
            <option value="FIT">FIT</option>
            <option value="UNFIT">UNFIT</option>
          </select>
        </FormStep>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Submit</button>
      </form>

      {pdfUrl && <QRDownload pdfUrl={pdfUrl} />}
    </div>
  );
};

export default MedicalForm;