const fs = require("fs");
const path = require("path");

// Daftar folder yang mau dicek di /public
const folders = ["menu", "logo2"];

folders.forEach(folder => {
  const dirPath = path.join(__dirname, "public", folder);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Folder tidak ditemukan: ${folder}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  if (files.length === 0) {
    console.log(`⚠️ Folder kosong: ${folder}`);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found: ${folder}/${file}`);
    } else {
      console.log(`❌ Missing: ${folder}/${file}`);
    }
  });
});

console.log("\n✅ Semua folder dicek!");
