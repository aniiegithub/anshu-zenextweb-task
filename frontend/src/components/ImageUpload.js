import React from 'react';

const ImageUpload = ({ image, setImage }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
    } else {
      alert('Please upload a JPG or PNG image.');
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {image && (
        <div className="flex justify-start items-center">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-32 h-32 rounded-md object-cover border shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
