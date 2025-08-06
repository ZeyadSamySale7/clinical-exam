// تهيئة كائن Luxon للتعامل مع التواريخ
const DateTime = luxon.DateTime;

document.addEventListener("DOMContentLoaded", function () {
  // تحديث سنة حقوق النشر
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // معالجة النموذج الرئيسي
  const patientForm = document.getElementById('patientForm');
  if (patientForm) {
    patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      savePatientData(this);
    });
  }

  // عرض بيانات المرضى
  displayPatientRecords();
});

function savePatientData(form) {
  const formData = new FormData(form);
  const patient = {};
  
  // تحويل FormData إلى كائن
  formData.forEach((value, key) => {
    patient[key] = value;
  });

  // إضافة بيانات الوقت
  patient.dateSaved = DateTime.now().toLocaleString(DateTime.DATETIME_MED);
  patient.id = Date.now(); // معرف فريد لكل مريض

  // الحصول على البيانات الحالية أو تهيئة مصفوفة جديدة
  let patients = JSON.parse(localStorage.getItem('patients')) || [];
  
  // إضافة المريض الجديد
  patients.push(patient);
  
  // حفظ في localStorage
  localStorage.setItem('patients', JSON.stringify(patients));
  
  // عرض تنبيه والانتقال لصفحة السجلات
  alert('Patient data saved successfully!');
  window.location.href = 'patients.html';
}

function displayPatientRecords() {
  const patientsList = document.getElementById('patients-list');
  if (!patientsList) return;

  const patients = JSON.parse(localStorage.getItem('patients')) || [];
  
  if (patients.length === 0) {
    patientsList.innerHTML = `
      <div class="card empty-state">
        <i class="fas fa-user-slash"></i>
        <h3>No Patient Records Found</h3>
        <p>Start by adding new patients from the examination form</p>
        <a href="index.html" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add New Patient
        </a>
      </div>
    `;
    return;
  }

  // عرض كل المرضى
  patientsList.innerHTML = '';
  patients.forEach((patient, index) => {
    const card = document.createElement('div');
    card.className = 'card patient-card';
    card.innerHTML = `
      <div class="patient-header">
        <h2>${patient['Full Name'] || 'Unknown Patient'}</h2>
        <span class="patient-id">MRN: ${patient['Medical Record No.'] || 'N/A'}</span>
      </div>
      <div class="patient-details">
        <p><i class="fas fa-user"></i> <strong>Age:</strong> ${patient['Age'] || '-'} | <strong>Gender:</strong> ${patient['Gender'] || '-'}</p>
        <p><i class="fas fa-phone"></i> <strong>Phone:</strong> ${patient['Phone'] || '-'}</p>
        <p><i class="fas fa-calendar"></i> <strong>Last Updated:</strong> ${patient.dateSaved || '-'}</p>
      </div>
      <div class="patient-actions">
        <button class="btn btn-small btn-view" onclick="viewPatientDetails(${patient.id})">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn btn-small btn-delete" onclick="deletePatient(${patient.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    patientsList.appendChild(card);
  });

  // إضافة وظيفة البحث إذا كان هناك حقل بحث
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const filtered = patients.filter(p => 
        (p['Full Name'] || '').toLowerCase().includes(searchTerm)
      );
      renderFilteredPatients(filtered);
    });
  }
}

function renderFilteredPatients(filteredPatients) {
  // ... (كود مشابه لـ displayPatientRecords ولكن مع البيانات المصفاة)
}

function deletePatient(patientId) {
  // ... (كود لحذف المريض)
}

function viewPatientDetails(patientId) {
  // ... (كود لعرض تفاصيل المريض في نموذج منبثق)
}
function downloadPatientData(button) {
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");
  
  const patientData = {
    name: cells[0].innerText,
    age: cells[1].innerText,
    gender: cells[2].innerText,
    diagnosis: cells[3].innerText,
    notes: cells[4].innerText,
  };

  const jsonString = JSON.stringify(patientData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${patientData.name.replace(/\s+/g, "_")}_data.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
