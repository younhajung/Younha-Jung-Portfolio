const grid = document.getElementById('portfolio-grid');
const totalImages = 36;

// 1. 이미지 태그 생성
for (let i = 1; i <= totalImages; i++) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    
    const img = document.createElement('img');
    // loading="lazy"를 사용하여 브라우저 최적화 로딩 적용
    img.src = `images/${i}.webp`; 
    img.alt = `Portfolio Page ${i}`;
    img.loading = "lazy"; 

    div.appendChild(img);
    grid.appendChild(div);
}

// 2. 스크롤 애니메이션 (Intersection Observer)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.portfolio-item').forEach(item => {
    observer.observe(item);
});
/* =========================================
   위로 가기(TOP) 버튼 생성 및 스크롤 로직
========================================= */

// 1. 버튼 HTML 요소를 자바스크립트로 생성해서 바디에 넣기
const topBtn = document.createElement('button');
topBtn.id = 'topBtn';
topBtn.innerHTML = '↑ TOP';
document.body.appendChild(topBtn);

// 2. 스크롤 위치를 감지해서 버튼을 보여주거나 숨기기
window.addEventListener('scroll', () => {
    // 위에서부터 600px 이상 스크롤해서 내려오면 버튼 등장
    if (window.scrollY > 600) {
        topBtn.classList.add('show');
    } else {
        topBtn.classList.remove('show');
    }
});

// 3. 버튼 클릭 시 맨 위로 부드럽게 스크롤 (스무스 스크롤링)
topBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// 페이지가 다 로드된 후 투명 버튼 추가
window.addEventListener('load', () => {
    // 첫 번째 이미지 컨테이너 선택
    const firstItem = document.querySelectorAll('.portfolio-item')[0];
    firstItem.style.position = 'relative';

    // 1. 메일 보내기 투명 버튼
    const emailLink = document.createElement('a');
    emailLink.href = 'mailto:yuna.jung@gmail.com'; 
    emailLink.className = 'contact-hover-box email-box';
    emailLink.title = '메일 보내기';

    // 2. 전화 걸기 투명 버튼 (호주 담당자가 바로 걸 수 있게 +61 추가)
    const phoneLink = document.createElement('a');
    phoneLink.href = 'tel:+61411592327'; // 0411에서 0을 뺀 호주 번호 형식
    phoneLink.className = 'contact-hover-box phone-box';
    phoneLink.title = '전화 걸기';

    firstItem.appendChild(emailLink);
    firstItem.appendChild(phoneLink);
});
/* =========================================
   1. 커스텀 커서 움직임 구현
========================================= */
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

window.addEventListener('mousemove', (e) => {
    // 커서가 실제 마우스 좌표를 따라다니게 설정
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// 브라우저 밖으로 마우스가 나가면 커서 숨기기
document.addEventListener('mouseleave', () => cursor.style.display = 'none');
document.addEventListener('mouseenter', () => cursor.style.display = 'block');

/* =========================================
   2. 목차 폴더 클릭 시 해당 섹션으로 이동
========================================= */
window.addEventListener('load', () => {
    const items = document.querySelectorAll('.portfolio-item');
    
    // 4번째 이미지 (배열로는 3번 인덱스)가 Contents 페이지라고 지정
    const contentsPage = items[2]; 
    contentsPage.style.position = 'relative';

    // 폴더 3개 세팅 (⭐️ 여기서 targetIndex 숫자를 꼭 수정해 주세요!)
    const folders = [
        // Art Film이 5번째 사진(index 4)부터 시작한다면 targetIndex: 4
        { name: 'art', className: 'folder-box folder-art', targetIndex: 3 }, 
        
        // Editing이 몇 번째 사진부터 시작하나요? (예: 15번째 사진이면 targetIndex: 16)
        { name: 'edit', className: 'folder-box folder-edit', targetIndex: 15 }, 
        
        // Motion Graphics가 몇 번째 사진부터 시작하나요? (예: 25번째 사진이면 targetIndex: 29)
        { name: 'motion', className: 'folder-box folder-motion', targetIndex: 28 }
    ];

    folders.forEach(folder => {
        const box = document.createElement('div');
        box.className = folder.className;
        
        // 클릭 시 해당 이미지 인덱스로 부드럽게 스크롤
        box.addEventListener('click', () => {
            if(items[folder.targetIndex]) {
                items[folder.targetIndex].scrollIntoView({ behavior: 'smooth' });
            }
        });

        // 폴더에 마우스 올리면 커스텀 커서 커지게 연동
        box.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        box.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        
        contentsPage.appendChild(box);
    });

    // 💡 아까 만든 Contact 투명 버튼과 우측 하단 TOP 버튼에도 커서 커지는 효과 추가
    document.querySelectorAll('.contact-hover-box, #topBtn').forEach(btn => {
        btn.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        btn.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
});
/* =========================================
   3. 상단 영상 재생 타임라인 (스크롤 프로그레스 바)
========================================= */
const progressContainer = document.createElement('div');
progressContainer.id = 'progress-bar-container';

const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';

progressContainer.appendChild(progressBar);
document.body.appendChild(progressContainer);

// 스크롤 할 때마다 진행률 계산해서 파란 줄 늘리기
window.addEventListener('scroll', () => {
    // 전체 페이지 높이 계산
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 퍼센트 계산
    const scrollPercent = (totalScroll / windowHeight) * 100;
    
    // 바 너비 적용
    progressBar.style.width = scrollPercent + '%';
});
