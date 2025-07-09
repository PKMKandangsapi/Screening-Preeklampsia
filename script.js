function hitungUsia() {
  const birthdate = document.getElementById('birthdate').value;
  if (birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    document.getElementById('age').value = age;
  }
}

function hitungUsiaKehamilan() {
  const hpht = document.getElementById('hpht').value;
  if (hpht) {
    const hphtDate = new Date(hpht);
    const today = new Date();

    const diffInMs = today - hphtDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const gestationalWeeks = Math.floor(diffInDays / 7);

    if (gestationalWeeks >= 1 && gestationalWeeks <= 42) {
      document.getElementById('gestationalAge').value = gestationalWeeks;
    }
  }
}

function hitungSkor() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const gestationalAge = parseInt(document.getElementById('gestationalAge').value);
  const weight0 = parseFloat(document.getElementById('weight0').value); // Berat sebelum hamil
  const weight = parseFloat(document.getElementById('weight').value);  // Berat saat ini
  const height = parseFloat(document.getElementById('height').value);
  const systolic = parseInt(document.getElementById('systolic').value);
  const diastolic = parseInt(document.getElementById('diastolic').value);
  const riskCheckboxes = document.querySelectorAll('input[name="risk"]:checked');

  // Perhitungan BMI
  const bmi = (weight0 / ((height / 100) ** 2)).toFixed(2);
  const bmiBeforePregnancy = weight0 ? (weight0 / ((height / 100) ** 2)).toFixed(2) : "N/A";
  const bmiCurrent = weight && height ? (weight / ((height / 100) ** 2)).toFixed(2) : "N/A";

  // Perhitungan MAP
  const map = (systolic + 2 * diastolic) / 3;

  // Penilaian faktor risiko dari checkbox
  let totalRiskScore = 0;
  let tinggiRisiko = 0;
  let sedangRisiko = 0;
  let faktorRisikoOtomatis = [];

  riskCheckboxes.forEach(checkbox => {
    totalRiskScore += parseInt(checkbox.value);
    if (checkbox.value == "2") {
      tinggiRisiko++;
    } else if (checkbox.value == "1") {
      sedangRisiko++;
    }
  });

  // 1. Usia ≥35 tahun sebagai risiko sedang
  const usiaRisiko = age >= 35;
  const checkboxUsia = Array.from(document.querySelectorAll('input[name="risk"]')).find(el => el.parentElement.innerText.includes("Usia ≥35 tahun"));
  if (usiaRisiko && !checkboxUsia.checked) {
    sedangRisiko++;
    totalRiskScore++;
    faktorRisikoOtomatis.push("Usia ≥35 tahun (otomatis)");
  }

  // 2. BMI >30 sebagai risiko sedang (berdasarkan berat sebelum hamil)
  if (bmi > 30) {
    const checkboxBmi = Array.from(document.querySelectorAll('input[name="risk"]')).find(el => el.parentElement.innerText.includes("Obesitas sebelum hamil"));
    if (!checkboxBmi.checked) {
      sedangRisiko++;
      totalRiskScore++;
      faktorRisikoOtomatis.push("Obesitas sebelum hamil (BMI >30) (otomatis)");
    }
  }

  // 3. MAP >90 mmHg sebagai risiko sedang
  if (map > 90) {
    sedangRisiko++;
    totalRiskScore++;
    faktorRisikoOtomatis.push("Tekanan darah tinggi (MAP >90 mmHg) (otomatis)");
  }

  // Kategori risiko
  let riskCategory = '';
  if (totalRiskScore >= 2) {
    riskCategory = 'Risiko Tinggi';
  } else {
    riskCategory = 'Risiko Rendah - Sedang';
  }

  // Anjuran pemberian aspirin
  let anjuranText = 'Tidak diperlukan pemberian aspirin.';
  if (tinggiRisiko >= 1 || sedangRisiko >= 2) {
    anjuranText = 'Anjuran: Pemberian Aspirin 80 mg/hari dimulai antara minggu ke-12 dan ke-28, optimal sebelum minggu ke-16. Suplementasi kalsium 1x1000mg atau 2x500mg per hari.';
  }

  // Menampilkan hasil
  const resultText = document.getElementById('resultText');
  resultText.innerHTML = `
  <strong>Nama:</strong> ${name}<br>
  <strong>Usia:</strong> ${age} tahun<br>
  <strong>Usia Kehamilan:</strong> ${gestationalAge} minggu<br>
  <strong>BMI Sebelum Hamil:</strong> ${bmiBeforePregnancy}<br>
  <strong>BMI Saat Ini:</strong> ${bmiCurrent}<br>
  <strong>MAP:</strong> ${map.toFixed(2)} mmHg<br>
  
  <strong>Kategori Risiko:</strong> ${riskCategory}<br><br>
  <strong>Faktor Risiko:</strong><br>
  ${[
    ...Array.from(riskCheckboxes).map(checkbox => checkbox.parentElement.innerText),
    ...faktorRisikoOtomatis
  ].join('<br>')}
  `;


  const anjuran = document.getElementById('anjuranText');
  anjuran.innerHTML = anjuranText;

  document.getElementById('hasil').style.display = 'block';
}

function simpanHasil() {
  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const gestationalAge = parseInt(document.getElementById('gestationalAge').value);
  const bmiBeforePregnancy = parseFloat(document.getElementById('bmiBeforePregnancy').value); // Menghitung BMI
  const bmiCurrent = parseFloat(document.getElementById('bmiCurrent').value); // Menghitung BMI
  const map = parseFloat(document.getElementById('map').value); // Menghitung MAP
  const riskCategory = document.getElementById('riskCategory').value;
  const riskFactors = getSelectedRiskFactors(); // Ambil faktor risiko yang dipilih

  const data = {
    name,
    age,
    gestationalAge,
    bmiBeforePregnancy,
    bmiCurrent,
    map,
    riskCategory,
    riskFactors,
  };

  // URL Web App Google Apps Script yang sudah kamu buat
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyhs2nVPmOD2gy6zGce-p6AXPuNZqq81FGckzKodopM227iORVvXG6J5aS0voDQyvR4xQ/exec';  // Gantilah dengan URL Web App

  // Mengirim data ke Google Sheets menggunakan Fetch API
  fetch(googleScriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.text())
  .then(data => {
    alert('Hasil screening berhasil disimpan ke Google Sheets!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Gagal menyimpan hasil screening!');
  });
}

function getSelectedRiskFactors() {
  const selectedFactors = [];
  const riskCheckboxes = document.querySelectorAll('input[name="risk"]:checked');
  riskCheckboxes.forEach(checkbox => {
    selectedFactors.push(checkbox.parentElement.innerText);
  });
  return selectedFactors.join(', ');
}
