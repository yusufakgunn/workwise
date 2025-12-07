export default function AppDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Başlık + açıklama */}
            <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-slate-900/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                    Genel Bakış
                </p>
                <h1 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                    Çalışma alanınıza hoş geldiniz.
                </h1>
                <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                    WorkWise ile projelerinizi, görevlerinizi ve ekibinizi tek bir merkezden
                    organize edebilirsiniz. Başlamak için aşağıdaki adımlardan birini seçin.
                </p>
            </div>

            {/* Özet kartlar */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Aktif projeler
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-50">0</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Projeleri <span className="text-sky-300">Projeler</span> sekmesinden
                        oluşturmaya başlayın.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Açık görevler
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-50">0</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Görevler, projelere bağlı olarak{' '}
                        <span className="text-sky-300">Görevler</span> ekranında listelenecek.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Ekip üyeleri
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-50">1</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Ekibinizi <span className="text-sky-300">Ekip</span> sekmesinden yöneteceksiniz.
                    </p>
                </div>
            </div>

            {/* Alt bilgi alanı */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-100">
                        İlk projenizi oluşturun
                    </h2>
                    <p className="mt-2 text-xs text-slate-400">
                        WorkWise, projeleri merkeze alan bir yaklaşım kullanır. Önce bir proje
                        oluşturun, ardından o projeye görevler ekleyin ve ekip arkadaşlarınızı
                        davet edin.
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-100">
                        Görev akışınızı düzenleyin
                    </h2>
                    <p className="mt-2 text-xs text-slate-400">
                        Görevlerin durumlarını ve önceliklerini takip ederek ekibinizin çalışma
                        temposunu daha görünür hale getirebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    )
}
