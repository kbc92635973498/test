import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Settings, Scan, AlertTriangle, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScan } from '../contexts/ScanContext';
import ScanConfirmModal from '../components/ScanConfirmModal';
import Footer from '../components/Footer';

function Home() {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState<'bulk' | 'detailed'>('bulk');
  const [scanOptions, setScanOptions] = useState({
    sqlInjection: true,
    directoryTraversal: true,
    xss: true,
    portScan: true,
  });
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const { logout, user } = useAuth();
  const { startScan, isScanning } = useScan();
  const navigate = useNavigate();


  // 新たに追加：ランダムアニメーション用の状態
  const [animationUrl, setAnimationUrl] = useState('');

  // ランダムに選ぶアニメーションリンク一覧
  const animationLinks = [
    'https://lottie.host/95d55f3f-c151-4b0f-be85-0beb562f8b75/06LlRW7dCN.lottie',
    'https://lottie.host/96206794-804f-492d-a804-9f1f7bd0c4a9/244DkcPTre.lottie',
    'https://lottie.host/106c06df-90cc-4491-857e-b9479e8e32c2/9qpvz0cF2h.lottie',
    'https://lottie.host/e2ec55e0-e408-423d-ba9a-4c961d75c0fb/wij0MCcBhJ.lottie',
    'https://lottie.host/db8ac7eb-bac5-44b7-8cba-1dd62709bbd7/ZpQYKJ913h.lottie'

    // 必要に応じて追加可能
  ];

  // マウント時にランダムに1つ選ぶ
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * animationLinks.length);
    setAnimationUrl(animationLinks[randomIndex]);
  }, []);

  
  const handleScanOptionChange = (option: keyof typeof scanOptions) => {
    setScanOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleScanClick = () => {
    setError('');

    if (!targetUrl) {
      setError('スキャン対象のURLを入力してください');
      return;
    }

    if (scanType === 'detailed') {
      const selectedOptions = Object.entries(scanOptions).filter(([_, enabled]) => enabled);
      if (selectedOptions.length === 0) {
        setError('詳細スキャンでは少なくとも1つのオプションを選択してください');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmScan = async () => {
    setShowConfirmModal(false);

    const optionNames = {
      sqlInjection: 'SQL Injection',
      directoryTraversal: 'Directory Traversal',
      xss: 'XSS',
      portScan: 'Open Port'
    };

    const selectedScanOptions = scanType === 'detailed' 
      ? Object.entries(scanOptions)
          .filter(([_, enabled]) => enabled)
          .map(([key, _]) => optionNames[key as keyof typeof optionNames])
      : undefined;

    await startScan(targetUrl, scanType, selectedScanOptions);
    navigate('/dashboard');
  };

  const getSelectedOptions = () => {
    const optionNames = {
      sqlInjection: 'SQL Injection',
      directoryTraversal: 'Directory Traversal',
      xss: 'XSS',
      portScan: 'Open Port'
    };

    return Object.entries(scanOptions)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => optionNames[key as keyof typeof optionNames]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">


 {isScanning && animationUrl && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white flex justify-center items-center z-[9999]">
          <dotlottie-player
            src={animationUrl}
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: '300px', height: '300px' }}
          ></dotlottie-player>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SecureGuard</h1>
              <p className="text-sm text-gray-600">脆弱性スキャナー</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">セキュリティスキャン</h2>
          <p className="text-lg text-gray-600">Webサイトの脆弱性を検出し、セキュリティリスクを評価します</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="space-y-8">
            {/* Target URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                スキャン対象URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Scan Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                スキャンタイプ
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setScanType('bulk')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    scanType === 'bulk'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Scan className={`w-6 h-6 ${scanType === 'bulk' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className={`text-lg font-semibold ${scanType === 'bulk' ? 'text-blue-900' : 'text-gray-900'}`}>
                      一括スキャン
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    すべての脆弱性を包括的にスキャンします。初回スキャンに推奨です。
                  </p>
                </div>

                <div
                  onClick={() => setScanType('detailed')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    scanType === 'detailed'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Settings className={`w-6 h-6 ${scanType === 'detailed' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className={`text-lg font-semibold ${scanType === 'detailed' ? 'text-blue-900' : 'text-gray-900'}`}>
                      詳細スキャン
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    特定の脆弱性タイプを選択してスキャンします。
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Scan Options */}
            {scanType === 'detailed' && (
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">スキャンオプション</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'sqlInjection', label: 'SQLインジェクション', description: 'データベースへの不正アクセス' },
                    { key: 'directoryTraversal', label: 'ディレクトリトラバーサル', description: 'ファイルシステムへの不正アクセス' },
                    { key: 'xss', label: 'XSS (クロスサイトスクリプティング)', description: 'スクリプト実行攻撃' },
                    { key: 'portScan', label: 'ポートスキャン', description: '開放ポートの検出' },
                  ].map(({ key, label, description }) => (
                    <label key={key} className="flex items-start space-x-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={scanOptions[key as keyof typeof scanOptions]}
                        onChange={() => handleScanOptionChange(key as keyof typeof scanOptions)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScanClick}
              disabled={isScanning}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              <Scan className="w-5 h-5" />
              <span>{isScanning ? 'スキャン実行中...' : 'スキャン開始'}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <ScanConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmScan}
        targetUrl={targetUrl}
        scanType={scanType}
        selectedOptions={scanType === 'detailed' ? getSelectedOptions() : undefined}
      />
    </div>
  );
}

export default Home;