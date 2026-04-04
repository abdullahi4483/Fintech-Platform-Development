import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { currentUser, addWithdrawal } = useAppContext();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > currentUser.balance) {
      alert('Insufficient balance');
      return;
    }

    addWithdrawal({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount: parseFloat(amount),
      status: 'Pending'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAmount('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-[#141e32]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-[#c9a84c]/40 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Content */}
              {submitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                    <div className="text-[#10b981]" style={{ fontSize: '32px' }}>
                      ✓
                    </div>
                  </div>
                  <h2 className="font-heading mb-4" style={{ fontSize: '28px', color: '#ffffff' }}>
                    Request Submitted
                  </h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Your withdrawal request is being processed
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
                      <div className="text-[#c9a84c]" style={{ fontSize: '24px' }}>
                        💰
                      </div>
                    </div>

                    <h2 className="font-heading mb-2" style={{ fontSize: '28px', color: '#ffffff' }}>
                      Withdrawal Request
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Available Balance: ${currentUser?.balance.toLocaleString() || '0'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Withdrawal Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[#c9a84c]/20 text-white placeholder:text-white/40 focus:border-[#c9a84c] focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#c9a84c] text-[#0a0e1a] rounded-lg hover:bg-[#b89640] transition-all hover:scale-105"
                  >
                    Submit Request
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full px-6 py-3 border border-[#c9a84c]/40 text-white rounded-lg hover:border-[#c9a84c] transition-all"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
