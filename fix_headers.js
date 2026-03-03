const fs = require('fs');
const files = [
    'app/page.tsx',
    'app/video/[id]/page.tsx',
    'app/video/page.tsx',
    'app/ngoai-hang-anh/page.tsx',
    'app/la-liga/page.tsx',
    'app/chuyen-nhuong/page.tsx',
    'app/lich-thi-dau/page.tsx'
];
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<div className="container" style={{ background: '#f4f4f4', minHeight: '100vh' }}>/g, '<div style={{ background: \'#f4f4f4\', minHeight: \'100vh\' }}>');
    content = content.replace(/<div className="container" style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>/g, '<div style={{ backgroundColor: \'#f4f4f4\', minHeight: \'100vh\' }}>');
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
});
