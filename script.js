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

  // Ambil data yang diinput untuk dikirim ke Google Sheets
  const data = {
    name,
    age,
    gestationalAge,
    bmiBeforePregnancy,
    bmiCurrent,
    map,
    riskCategory,
    faktorRisikoOtomatis,
    anjuranText
  };

  // URL Web App Google Apps Script yang sudah kamu buat
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyhs2nVPmOD2gy6zGce-p6AXPuNZqq81FGckzKodopM227iORVvXG6J5aS0voDQvyR4xQ/exec';  // Gantilah dengan URL Web App yang kamu dapatkan

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
