const STORAGE_KEY = 'campus_services_data';
const CATEGORY_KEY = 'campus_service_categories';
const AUTH_KEY = 'polsrijasa_auth';
const DEMO_ACCOUNT = {
	email: 'demo@polsrijasa.com',
	password: 'demo123',
	name: 'Demo User'
};
const defaultCategories = [
	{ value: 'desain', label: 'Desain' },
	{ value: 'pengetikan', label: 'Pengetikan' },
	{ value: 'koding', label: 'Koding' },
	{ value: 'servis', label: 'Servis' },
	{ value: 'les', label: 'Les' }
];

const sampleServices = [
	{ id: 'srv-1', title: 'Format Dokumen & Sitasi Mendeley', category: 'pengetikan', sellerName: 'Andi', whatsapp: '6281234567890', price: 25000, unit: 'per dokumen', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', description: 'Rapikan skripsi, format, dan daftar pustaka.', rating: 4.9 },
	{ id: 'srv-2', title: 'Desain Slide Presentasi', category: 'desain', sellerName: 'Sinta', whatsapp: '6289876543210', price: 35000, unit: 'per 10 slide', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', description: 'Slide presentasi dengan tampilan rapi dan profesional.', rating: 4.8 },
	{ id: 'srv-3', title: 'Pembuatan Website Portofolio', category: 'koding', sellerName: 'Raka', whatsapp: '6287654321987', price: 500000, unit: 'per project', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', description: 'Buat landing page sederhana untuk tugas atau branding.', rating: 5 },
	{ id: 'srv-4', title: 'Servis Laptop & Install Ulang', category: 'servis', sellerName: 'Budi', whatsapp: '6281122334455', price: 75000, unit: 'per sesi', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', description: 'Install sistem operasi dan cek laptop ringan.', rating: 4.7 },
	{ id: 'srv-5', title: 'Les Privat Matematika', category: 'les', sellerName: 'Nadya', whatsapp: '6285566778899', price: 60000, unit: 'per sesi', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', description: 'Bimbingan belajar matematika dan statistika.', rating: 4.9 },
	{ id: 'srv-6', title: 'Ojek Online', category: 'Ojek', sellerName: 'Fajar', whatsapp: '6289988776655', price: 150000, unit: 'per project', imageUrl: 'https://www.banksinarmas.com/id/public/upload/images/5d48fbb379672_Tips%20Untung%20Menggunakan%20Ojek%20Online%20yang%20Wajib%20Milenial%20Ketahui.jpg', description: 'Layanan ojek online cepat dan aman.', rating: 4.6 }
];

const fallbackReviews = [
	{ author: 'Maya', rating: 5, text: 'Cepat, rapi, dan sesuai ekspektasi.' },
	{ author: 'Bimo', rating: 5, text: 'Hubungannya lancar dan hasilnya bagus.' },
	{ author: 'Cinta', rating: 4, text: 'Layanan bagus, tetapi sedikit lambat.' }
];

const pageState = { category: 'semua', query: '' };

function readServices() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleServices));
			return [...sampleServices];
		}

		const parsed = JSON.parse(saved);
		if (!Array.isArray(parsed) || parsed.length === 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleServices));
			return [...sampleServices];
		}

		return parsed;
	} catch (error) {
		return [...sampleServices];
	}
}

function readCategories() {
	try {
		const saved = localStorage.getItem(CATEGORY_KEY);
		if (!saved) {
			localStorage.setItem(CATEGORY_KEY, JSON.stringify(defaultCategories));
			return [...defaultCategories];
		}

		const parsed = JSON.parse(saved);
		return Array.isArray(parsed) && parsed.length ? parsed : [...defaultCategories];
	} catch (error) {
		return [...defaultCategories];
	}
}

function saveCategories(categories) {
	localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

function categoryValue(label) {
	return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderCategories() {
	const categories = readCategories();
	const filters = document.getElementById('categoryFilters');
	const categoryList = document.getElementById('categoryList');
	const select = document.getElementById('category');

	if (filters) {
		filters.innerHTML = categories.map((category) => `
			<button class="filter-btn" type="button" data-category="${category.value}">${category.label}</button>
		`).join('');
	}

	if (categoryList) {
		categoryList.innerHTML = categories.map((category) => `
			<span class="category-item">
				${category.label}
				<button class="category-remove" type="button" data-category-remove="${category.value}" aria-label="Hapus kategori ${category.label}">×</button>
			</span>
		`).join('');
	}

	if (select) {
		select.innerHTML = '<option value="">Pilih kategori</option>' + categories.map((category) => `
			<option value="${category.value}">${category.label}</option>
		`).join('');
	}
}

function initializeCategoryManager(renderList) {
	const categoryForm = document.getElementById('categoryForm');
	const categoryList = document.getElementById('categoryList');
	if (!categoryForm || !categoryList) return;

	categoryForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const input = document.getElementById('newCategory');
		const label = input.value.trim();
		const value = categoryValue(label);
		const categories = readCategories();

		if (!value) return;
		if (categories.some((category) => category.value === value)) {
			alert('Kategori tersebut sudah ada.');
			return;
		}

		categories.push({ value, label });
		saveCategories(categories);
		input.value = '';
		renderCategories();
		bindCategoryFilters(renderList);
	});

	categoryList.addEventListener('click', (event) => {
		const button = event.target.closest('[data-category-remove]');
		if (!button) return;

		const value = button.dataset.categoryRemove;
		const used = readServices().some((service) => service.category === value);
		if (used) {
			alert('Kategori masih digunakan oleh jasa dan tidak dapat dihapus.');
			return;
		}

		const nextCategories = readCategories().filter((category) => category.value !== value);
		saveCategories(nextCategories.length ? nextCategories : defaultCategories);
		renderCategories();
		bindCategoryFilters(renderList);
	});
}

function bindCategoryFilters(renderList) {
	document.querySelectorAll('.filter-btn').forEach((button) => {
		button.onclick = () => {
			pageState.category = button.dataset.category;
			document.querySelectorAll('.filter-btn').forEach((node) => node.classList.toggle('active', node === button));
			renderList();
		};
	});
}

function formatRupiah(value) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(value);
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function initializeHomePage() {
	const searchInput = document.getElementById('searchInput');
	const grid = document.getElementById('grid');
	if (!searchInput || !grid) return;

	function renderList() {
		const filtered = readServices().filter((item) => {
			const matchesCategory = pageState.category === 'semua' || item.category === pageState.category;
			const haystack = `${item.title} ${item.sellerName} ${item.description}`.toLowerCase();
			const matchesQuery = !pageState.query || haystack.includes(pageState.query.toLowerCase());
			return matchesCategory && matchesQuery;
		});

		const count = document.getElementById('count');
		const empty = document.getElementById('empty');
		count.textContent = `${filtered.length} jasa`;

		if (!filtered.length) {
			grid.innerHTML = '';
			empty.classList.add('show');
			return;
		}

		empty.classList.remove('show');
		grid.innerHTML = filtered.map((item) => `
			<article class="card">
				<div class="thumb">
					<span class="tag">${item.category}</span>
					<img src="${item.imageUrl}" alt="${item.title}" />
				</div>
				<div class="body">
					<h3 class="title">${item.title}</h3>
					<p class="seller">oleh ${item.sellerName}</p>
					<p class="price">${formatRupiah(item.price)} / ${item.unit}</p>
					<div class="meta">
						<span class="rating">★ ${Number(item.rating || 0).toFixed(1)}</span>
						<div class="actions">
							<a class="detail-btn" href="detail.html?id=${item.id}">Detail</a>
							<button class="remove-btn" type="button" data-remove="${item.id}">Hapus</button>
						</div>
					</div>
				</div>
			</article>
		`).join('');
	}

	searchInput.addEventListener('input', (event) => {
		pageState.query = event.target.value.trim();
		renderList();
	});

	renderCategories();
	bindCategoryFilters(renderList);
	initializeCategoryManager(renderList);

	grid.addEventListener('click', (event) => {
		const button = event.target.closest('[data-remove]');
		if (!button) return;

		const id = button.dataset.remove;
		const nextItems = readServices().filter((item) => item.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
		renderList();
	});

	renderList();
}

function initializeDetailPage() {
	const app = document.getElementById('app');
	if (!app) return;

	const params = new URLSearchParams(window.location.search);
	const currentId = params.get('id');
	const service = readServices().find((item) => item.id === currentId);

	document.addEventListener('click', (event) => {
		const button = event.target.closest('[data-delete]');
		if (!button) return;

		const id = button.dataset.delete;
		const confirmed = window.confirm('Yakin ingin menghapus jasa ini?');
		if (!confirmed) return;

		const nextItems = readServices().filter((item) => item.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
		window.location.href = 'index.html';
	});

	if (!service) {
		app.innerHTML = `
			<div class="card not-found">
				<h2>Jasa tidak ditemukan</h2>
				<p class="muted">Data yang diminta tidak tersedia atau sudah dihapus.</p>
				<a class="btn btn-primary" href="index.html">Kembali</a>
			</div>
		`;
		return;
	}

	const reviews = Array.isArray(service.reviews) && service.reviews.length ? service.reviews : fallbackReviews;
	const waText = encodeURIComponent(`Halo ${service.sellerName}, saya tertarik dengan jasa "${service.title}". Bisa lanjutkan?`);
	const waUrl = `https://wa.me/${service.whatsapp}?text=${waText}`;

	app.innerHTML = `
		<div class="detail-layout">
			<article class="card detail-image">
				<img src="${service.imageUrl}" alt="${service.title}" />
			</article>

			<aside class="card detail-content">
				<span class="tag">${service.category}</span>
				<h1>${service.title}</h1>
				<div class="meta">
					<span>Oleh ${service.sellerName}</span>
					<span>★ ${Number(service.rating || 0).toFixed(1)}</span>
				</div>
				<div class="detail-price">${formatRupiah(service.price)} / ${service.unit}</div>
				<div class="actions">
					<a class="btn btn-primary" href="${waUrl}" target="_blank" rel="noopener noreferrer">Hubungi via WhatsApp</a>
					<button class="btn btn-danger" type="button" data-delete="${service.id}">Hapus Jasa</button>
				</div>
			</aside>
		</div>

		<section class="card" style="margin-top: 26px; padding: 24px;">
			<h2 style="margin-top: 0;">Deskripsi</h2>
			<p class="detail-description">${escapeHtml(service.description)}</p>
			<ul class="detail-notes">
				<li>Estimasi pengerjaan: 1 sampai 3 hari</li>
				<li>Komunikasi langsung saat proses berlangsung</li>
				<li>Revisi bisa ditambah sesuai kesepakatan</li>
			</ul>
		</section>

		<section class="reviews" style="margin-top: 26px;">
			<h2>Ulasan pelanggan</h2>
			<div class="review-list">
				${reviews.map((review) => `
					<article class="review-item">
						<div class="review-head">
							<span>${review.author}</span>
							<span>★ ${Number(review.rating || 0).toFixed(1)}</span>
						</div>
						<p class="review-text">${review.text}</p>
					</article>
				`).join('')}
			</div>
		</section>
	`;
}

function getCurrentUser() {
	try {
		const saved = localStorage.getItem(AUTH_KEY);
		if (!saved) return null;
		const parsed = JSON.parse(saved);
		return parsed && parsed.email ? parsed : null;
	} catch (error) {
		return null;
	}
}

function saveCurrentUser(user) {
	localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
	localStorage.removeItem(AUTH_KEY);
}

function initializeAuthControls() {
	const user = getCurrentUser();
	const logoutButton = document.getElementById('logoutButton');
	const userBadge = document.getElementById('userBadge');

	if (userBadge && user) {
		userBadge.textContent = user.name || user.email;
	}

	if (logoutButton) {
		logoutButton.addEventListener('click', () => {
			clearCurrentUser();
			window.location.href = 'login.html';
		});
	}
}

function redirectToLoginIfNeeded() {
	const currentPage = document.body.dataset.page;
	const isLoginPage = currentPage === 'login';
	const loggedIn = Boolean(getCurrentUser());

	if (!isLoginPage && !loggedIn) {
		window.location.href = 'login.html';
		return true;
	}

	if (isLoginPage && loggedIn) {
		window.location.href = 'index.html';
		return true;
	}

	return false;
}

function initializeLoginPage() {
	const form = document.getElementById('loginForm');
	if (!form) return;

	const emailInput = document.getElementById('email');
	if (emailInput) {
		emailInput.value = DEMO_ACCOUNT.email;
	}

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const password = String(formData.get('password') || '').trim();

		if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
			saveCurrentUser({
				email: DEMO_ACCOUNT.email,
				name: DEMO_ACCOUNT.name
			});
			window.location.href = 'index.html';
			return;
		}

		const errorBox = document.getElementById('loginError');
		if (errorBox) {
			errorBox.textContent = 'Email atau password salah. Gunakan akun demo yang tersedia di bawah form.';
		} else {
			alert('Email atau password salah. Gunakan akun demo yang tersedia di bawah form.');
		}
	});
}

function initializeFormPage() {
	const form = document.getElementById('form');
	if (!form) return;

	renderCategories();

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const data = new FormData(this);
		const title = String(data.get('title') || '').trim();
		const category = String(data.get('category') || '').trim();
		const sellerName = String(data.get('sellerName') || '').trim();
		const whatsapp = String(data.get('whatsapp') || '').replace(/\D/g, '');
		const price = Number(data.get('price'));
		const unit = String(data.get('unit') || '').trim();
		const imageUrl = String(data.get('imageUrl') || '').trim();
		const description = String(data.get('description') || '').trim();

		if (!title || !category || !sellerName || !unit || !imageUrl || !description) {
			alert('Semua field harus diisi.');
			return;
		}

		if (!/^628\d{8,12}$/.test(whatsapp)) {
			alert('Format WhatsApp salah. Gunakan angka diawali 628 tanpa + atau - .');
			return;
		}

		if (!Number.isFinite(price) || price <= 0) {
			alert('Harga harus angka yang valid.');
			return;
		}

		const items = readServices();
		items.unshift({
			id: `srv-${Date.now()}`,
			title,
			category,
			sellerName,
			whatsapp,
			price,
			unit,
			imageUrl,
			description,
			rating: 4.8,
			createdAt: new Date().toISOString().slice(0, 10)
		});

		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		alert('Jasa berhasil ditambahkan.');
		window.location.href = 'index.html';
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const page = document.body.dataset.page;

	if (page !== 'login') {
		if (redirectToLoginIfNeeded()) {
			return;
		}
		initializeAuthControls();
	}

	if (page === 'login') {
		if (redirectToLoginIfNeeded()) {
			return;
		}
		initializeLoginPage();
	}

	if (page === 'home') {
		initializeHomePage();
	}

	if (page === 'detail') {
		initializeDetailPage();
	}

	if (page === 'form') {
		initializeFormPage();
	}
});
