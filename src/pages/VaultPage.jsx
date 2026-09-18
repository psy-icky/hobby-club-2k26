import React, { useState, useRef } from 'react';
import { 
  FolderLock, 
  Upload, 
  Receipt, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  X, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  User, 
  Sparkles,
  Layers,
  Lock,
  CloudUpload
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';

export const VaultPage = () => {
  const { files, uploadFile, deleteFile } = useClubData();
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  // Form states for upload
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bill');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('image');
  const fileInputRef = useRef(null);

  // Permission check: Only Smit (Technical Head), Krishna (President), Sanskruti (Vice President), and Harshad (Treasurer) can delete bills/photos
  const authorizedDeleteRoles = ['President', 'Vice President', 'Treasurer', 'Technical Head'];
  const authorizedDeleteIds = ['smit-barmate', 'krishna-choube', 'sanskruti-madankar', 'harshad-sahani'];

  const canDeleteFiles = 
    authorizedDeleteIds.includes(currentUser?.id) || 
    authorizedDeleteRoles.includes(currentUser?.role);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMb} MB`);

    if (file.type.startsWith('image/')) {
      setFileType('image');
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFilePreview(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileType('document');
      setFilePreview(null);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || (!filePreview && !fileName)) return;

    const newFileData = {
      title: title.trim(),
      category: category,
      amount: category === 'Bill' && amount.trim() ? `₹ ${amount.trim()}` : null,
      uploaderId: currentUser?.id || 'smit-barmate',
      uploaderName: `${currentUser?.name} (${currentUser?.role})`,
      date: new Date().toISOString().split('T')[0],
      fileType: fileType,
      fileUrl: filePreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      fileName: fileName || 'attachment.jpg',
      fileSize: fileSize || '1.5 MB',
      notes: notes.trim()
    };

    uploadFile(newFileData);

    // Reset form
    setTitle('');
    setAmount('');
    setNotes('');
    setFilePreview(null);
    setFileName('');
    setIsUploadModalOpen(false);
  };

  const handleDelete = (fileId, fileTitle) => {
    if (!canDeleteFiles) {
      alert('Permission Denied: Only President Krishna, Vice President Sanskruti, Treasurer Harshad, and Technical Head Smit can delete bills & vault records.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${fileTitle}"?`)) {
      deleteFile(fileId);
    }
  };

  const totalBillsAmount = files
    .filter(f => f.category === 'Bill' && f.amount)
    .reduce((acc, curr) => {
      const numeric = parseInt(curr.amount.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + numeric;
    }, 0);

  const filteredFiles = files.filter(file => {
    if (activeCategory !== 'all' && file.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = file.title.toLowerCase().includes(q);
      const matchUploader = file.uploaderName.toLowerCase().includes(q);
      const matchNotes = file.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchUploader && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white flex items-center gap-2.5">
            <FolderLock className="w-6 h-6 text-amber-400" />
            Bills, Invoices & Media Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official cloud repository for expense receipts, festival media, and executive records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-500/20 w-full sm:w-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Bill or Photo</span>
          </button>
        </div>
      </div>

      {/* Cloud & Permissions Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Expense Box */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bills Logged</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-display font-black text-white flex items-baseline gap-1">
              <span>₹</span>
              <span>{totalBillsAmount.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Across {files.filter(f => f.category === 'Bill').length} verified expense invoices
            </p>
          </div>
        </div>

        {/* Cloud Storage Status */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Architecture</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CloudUpload className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Cloud Database Active
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Files persist across devices & cloud deployment
            </p>
          </div>
        </div>

        {/* Security & Deletion Guard */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit & Deletion Access</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold text-white">
              President, VP, Treasurer & Tech Head
            </div>
            <p className="text-[10px] text-amber-300 mt-0.5">
              {canDeleteFiles ? '✓ You have full delete authorization' : '🔒 Read/Upload only (Protected from accidental deletion)'}
            </p>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Files', icon: Layers, count: files.length },
            { id: 'Bill', label: 'Bills & Receipts', icon: Receipt, count: files.filter(f => f.category === 'Bill').length },
            { id: 'Photo', label: 'Event Photos & Media', icon: ImageIcon, count: files.filter(f => f.category === 'Photo').length },
            { id: 'Document', label: 'Official Documents', icon: FileText, count: files.filter(f => f.category === 'Document').length }
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills, items, uploaders..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFiles.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No files or bills found in this section. Click "Upload Bill or Photo" to add one!
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="glass-card glass-card-hover rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* File Media Preview */}
                <div className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setViewingFile(file)}>
                  {file.fileType === 'image' ? (
                    <img
                      src={file.fileUrl}
                      alt={file.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4">
                      <FileText className="w-12 h-12 text-indigo-400 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">{file.fileName}</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-md border ${
                      file.category === 'Bill' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' :
                      file.category === 'Photo' ? 'bg-purple-950/80 text-purple-300 border-purple-500/40' :
                      'bg-blue-950/80 text-blue-300 border-blue-500/40'
                    }`}>
                      {file.category}
                    </span>

                    {file.amount && (
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-slate-950/90 text-amber-300 border border-amber-500/40 font-mono">
                        {file.amount}
                      </span>
                    )}
                  </div>

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-1 shadow-lg"
                    >
                      <Eye className="w-4 h-4" /> Full View
                    </button>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {file.title}
                  </h3>

                  {file.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {file.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-300 truncate">
                        <User className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{file.uploaderName}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">{file.date}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{file.fileName}</span>
                      <span>{file.fileSize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Bottom Bar */}
              <div className="p-3 px-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <a
                  href={file.fileUrl}
                  download={file.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <div className="flex items-center gap-2">
                  {canDeleteFiles ? (
                    <button
                      onClick={() => handleDelete(file.id, file.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete bill record (Authorized roles only)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-600 flex items-center gap-1" title="Protected Record">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Upload Bill, Receipt or Photo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saves to the club cloud repository for all 12 council members
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Bill Photo / Image File *
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/60 transition-all hover:bg-slate-950"
                >
                  {filePreview ? (
                    <div className="space-y-2">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-xl object-contain border border-slate-800"
                      />
                      <p className="text-xs font-bold text-amber-300 truncate">{fileName} ({fileSize})</p>
                      <span className="text-[10px] text-slate-400 underline">Click to choose another photo</span>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click to upload Bill receipt or Photo from your phone/PC
                      </p>
                      <p className="text-[10px] text-slate-500">
                        PNG, JPG, WEBP, or PDF up to 25MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Title / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stage lighting advance invoice"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bill">Expense Bill / Invoice</option>
                    <option value="Photo">Event Photo / Poster</option>
                    <option value="Document">Official Document / Permission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Amount {category === 'Bill' ? '(₹ Rupees)' : '(Optional)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={category === 'Bill' ? "e.g. 4,500" : "N/A"}
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notes / Payment Mode
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment mode (UPI/Cash), vendor details, approval notes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Save Bill to Cloud
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in" onClick={() => setViewingFile(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{viewingFile.title}</h3>
                <p className="text-xs text-slate-400">
                  Uploaded by {viewingFile.uploaderName} on {viewingFile.date} • {viewingFile.amount ? <strong className="text-amber-400">{viewingFile.amount}</strong> : viewingFile.category}
                </p>
              </div>
              <button
                onClick={() => setViewingFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2 border border-slate-800">
              {viewingFile.fileType === 'image' ? (
                <img
                  src={viewingFile.fileUrl}
                  alt={viewingFile.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl"
                />
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-3" />
                  <p className="font-bold text-white text-sm">{viewingFile.fileName}</p>
                  <p className="text-slate-400 mt-1">{viewingFile.fileSize}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 italic">
                {viewingFile.notes || 'No extra notes recorded.'}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={viewingFile.fileUrl}
                  download={viewingFile.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
