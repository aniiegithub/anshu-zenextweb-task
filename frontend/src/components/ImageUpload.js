import React from 'react';

const ImageUpload = ({ image, setImage }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {image && (
        <div className="mt-2">
          <img src={URL.createObjectURL(image)} alt="preview" className="w-32 h-32 object-cover" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
