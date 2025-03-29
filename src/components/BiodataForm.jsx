import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const capitalizeLabel = (str) => {
  return str
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const capitalizeValue = (str) => {
  if (typeof str !== 'string' || !str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const BiodataForm = () => {
  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      dob: '',
      education: '',
      occupation: ''
    },
    family: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: ''
    },
    contact: {
      mobile: '',
      address: ''
    },
    custom: {
      personal: [],
      family: [],
      contact: []
    },
    profile: null
  });

  const previewRef = useRef(null);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  
  const addCustomField = (section) => {
    const newField = { id: Date.now(), name: '', value: '' };
    setFormData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [section]: [...prev.custom[section], newField]
      }
    }));
  };


  const removeCustomField = (section, id) => {
    setFormData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [section]: prev.custom[section].filter(field => field.id !== id)
      }
    }));
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profile: reader.result }));
    };
    if(file) reader.readAsDataURL(file);
  };


  const generatePDF = () => {
    const element = previewRef.current;
    const opt = {
      margin: [10, 10],
      filename: 'biodata.pdf',
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="bg-white p-4 rounded shadow">
            
            <Section 
              title="Personal Details"
              fields={[
                { label: 'Full Name', id: 'fullName' },
                { label: 'Date of Birth', id: 'dob', type: 'date' },
                { label: 'Education', id: 'education' },
                { label: 'Occupation', id: 'occupation' }
              ]}
              section="personal"
              formData={formData}
              handleChange={handleInputChange}
              customFields={formData.custom.personal}
              addCustomField={() => addCustomField('personal')}
              removeCustomField={(id) => removeCustomField('personal', id)}
            />

           
            <Section 
              title="Family Details"
              fields={[
                { label: "Father's Name", id: 'fatherName' },
                { label: "Father's Occupation", id: 'fatherOccupation' },
                { label: "Mother's Name", id: 'motherName' },
                { label: "Mother's Occupation", id: 'motherOccupation' }
              ]}
              section="family"
              formData={formData}
              handleChange={handleInputChange}
              customFields={formData.custom.family}
              addCustomField={() => addCustomField('family')}
              removeCustomField={(id) => removeCustomField('family', id)}
            />

            
            <Section 
              title="Contact Details"
              fields={[
                { label: 'Mobile Number', id: 'mobile' },
                { label: 'Address', id: 'address', type: 'textarea' }
              ]}
              section="contact"
              formData={formData}
              handleChange={handleInputChange}
              customFields={formData.custom.contact}
              addCustomField={() => addCustomField('contact')}
              removeCustomField={(id) => removeCustomField('contact', id)}
            />

           
            <div className="mt-4">
              <label className="form-label">Profile Photo</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>
        </div>

     
        <div className="col-md-8">
          <div ref={previewRef} className="bg-white p-4 rounded shadow">
            <BiodataPreview data={formData} />
          </div>
          <button className="btn btn-warning mt-3" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};


const Section = ({ title, fields, section, formData, handleChange, customFields, addCustomField, removeCustomField }) => (
  <div className="section mb-4">
    <h4 className="mb-3">{title}</h4>
    {fields.map(field => (
      <div className="mb-3" key={field.id}>
        <label className="form-label">{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea
            className="form-control"
            value={formData[section][field.id]}
            onChange={(e) => handleChange(section, field.id, e.target.value)}
            rows="3"
          />
        ) : (
          <input
            type={field.type || 'text'}
            className="form-control"
            value={formData[section][field.id]}
            onChange={(e) => handleChange(section, field.id, e.target.value)}
          />
        )}
      </div>
    ))}

   
    {customFields.map(field => (
      <div className="dynamic-field-group mb-3 position-relative" key={field.id}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Field name"
            value={field.name}
            onChange={(e) => {
              const updatedFields = customFields.map(f => 
                f.id === field.id ? { ...f, name: e.target.value } : f
              );
              handleChange('custom', section, updatedFields);
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Value"
            value={field.value}
            onChange={(e) => {
              const updatedFields = customFields.map(f => 
                f.id === field.id ? { ...f, value: e.target.value } : f
              );
              handleChange('custom', section, updatedFields);
            }}
          />
        </div>
        <button 
          className="btn btn-danger btn-sm position-absolute end-0 top-50 translate-middle"
          onClick={() => removeCustomField(field.id)}
        >
          &times;
        </button>
      </div>
    ))}

    <button 
      className="btn btn-secondary btn-sm"
      onClick={addCustomField}
    >
      + Add Custom Field
    </button>
  </div>
);


const BiodataPreview = ({ data }) => (
  <div className="biodata-container">
    {data.profile && (
      <div className="profile-photo">
        <img src={data.profile} alt="Profile" className="img-fluid" />
      </div>
    )}
    
    <h1 className="text-center mb-4">BIODATA</h1>

    <SectionPreview 
      title="Personal Details" 
      data={data.personal} 
      custom={data.custom.personal} 
    />

    <SectionPreview 
      title="Family Details" 
      data={data.family} 
      custom={data.custom.family} 
    />

    <SectionPreview 
      title="Contact Details" 
      data={data.contact} 
      custom={data.custom.contact} 
    />
  </div>
);


const SectionPreview = ({ title, data, custom }) => {
  const displayLabels = {
    fullName: "Full Name",
    dob: "Date of Birth",
    fatherName: "Father's Name",
    fatherOccupation: "Father's Occupation",
    motherName: "Mother's Name",
    motherOccupation: "Mother's Occupation",
    mobile: "Mobile Number",
    address: "Address"
  };

  return (
    <div className="section-preview mb-4">
      <h2 className="section-title">{title}</h2>
      <table className="table">
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            const label = displayLabels[key] || capitalizeLabel(key);
            return (
              value && <tr key={key}>
                <td className="fw-bold">{label}:</td>
                <td>{capitalizeValue(value)}</td>
              </tr>
            );
          })}
          {custom.map(field => (
            field.name && field.value && <tr key={field.id}>
              <td className="fw-bold">{capitalizeLabel(field.name)}:</td>
              <td>{capitalizeValue(field.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BiodataForm;