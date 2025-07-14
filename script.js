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

// Simpan Gsheet
function SimpanGsheet() {
  <form id="FORM_ID" method="POST" action="https://script.google.com/macros/s/AKfycbxUNWv6hFtIR-qAzFLTbx_jNaMtBmiYuVVmV78zbqaMzOEfZ8K3aX6U10cg_FPihOXb/exec">
  <input name="Nama" type="text" placeholder="name" required>
  <input name="Usia" type="number" placeholder="age" required>
  <input name="Usia Kehamilan" type="number" placeholder="gestationalAge" required>
  <input name="Berat Badan Sebelum Hamil" type="number" placeholder="weight0" required>
  <input name="Berat Badan Saat Ini" type="number" placeholder="weight" required>
  <input name="Tinggi Badan" type="number" placeholder="height" required>
  <input name="BMI Sebelum Hamil" type="number" placeholder="bmiBeforePregnancy" required>
  <input name="BMI Saat Ini" type="number" placeholder="bmiCurrent" required>
  <input name="Sistol" type="number" placeholder="systolic" required>
  <input name="Diastol" type="number" placeholder="diastolic" required>
  <input name="MAP" type="number" placeholder="map" required>
  <input name="Faktor Risiko" type="checkbox" placeholder="riskCheckboxes" required>
  <input name="Kategori Risiko" type="text" placeholder="riskCategory" required>
  <button type="submit">Send</button>
</form>
}
