import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Lock,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Appointment,
  Language,
  PaymentTransaction,
  Pet,
  Role,
  UserProfile,
} from '../types';
import { translations } from '../i18n/translations';

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
  appointments: Appointment[];
  pets: Pet[];
  currentRole: Role;
  language: Language;
  onProcessPayment: (transaction: PaymentTransaction) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  appointments,
  pets,
  currentRole,
  language,
  onProcessPayment,
}) => {
  const t = translations[language];

  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvc, setCardCvc] = useState<string>('892');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentTransaction | null>(null);

  // Earnings calculations
  const totalGrossEarnings = transactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalTips = transactions.reduce((acc, curr) => acc + curr.tipAmount, 0);
  const netEarnings = transactions.reduce((acc, curr) => acc + curr.netPayout, 0);
  const pendingPayoutBalance = 145.50; // Current ready to transfer

  // Unpaid walks
  const unpaidAppointments = appointments.filter((a) => !a.isPaid && a.status === 'completed');

  const handleOpenCheckout = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowCheckoutModal(true);
  };

  const calculateTipAmount = () => {
    if (!selectedAppointment) return 0;
    if (customTip !== '') {
      return Math.max(0, parseFloat(customTip) || 0);
    }
    return Number(((selectedAppointment.price * tipPercent) / 100).toFixed(2));
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setIsProcessing(true);

    setTimeout(() => {
      const tipVal = calculateTipAmount();
      const basePrice = selectedAppointment.price;
      const total = Number((basePrice + tipVal).toFixed(2));
      const fee = Number((basePrice * 0.04).toFixed(2));
      const net = Number((total - fee).toFixed(2));

      const newTx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        appointmentId: selectedAppointment.id,
        walkSessionId: selectedAppointment.walkSessionId,
        ownerId: selectedAppointment.ownerId,
        walkerId: selectedAppointment.walkerId,
        amount: basePrice,
        tipAmount: tipVal,
        totalAmount: total,
        serviceFee: fee,
        netPayout: net,
        status: 'paid',
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
        receiptNumber: `REC-${Date.now().toString().slice(-8)}`,
        cardLast4: paymentMethod === 'card' ? '4242' : undefined,
      };

      onProcessPayment(newTx);
      setIsProcessing(false);
      setShowCheckoutModal(false);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white p-6 rounded-3xl border border-stone-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">{t.total_earnings}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono tracking-tight text-white">
            ${totalGrossEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-stone-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">+18.4%</span> this month
          </p>
        </div>

        {/* Pending Payout */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.pending_payouts}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono tracking-tight text-stone-900">
            ${pendingPayoutBalance.toFixed(2)}
          </p>
          <button
            onClick={() => {
              alert('Instant Payout initiated via Stripe Express. $145.50 transferred to linked checking account.');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{t.instant_payout}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tips Received */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Client Tips</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono tracking-tight text-stone-900">
            ${totalTips.toFixed(2)}
          </p>
          <p className="text-xs text-stone-400">
            Avg 22% tip per completed walk session
          </p>
        </div>
      </div>

      {/* Unpaid Completed Walks Alert (if any) */}
      {unpaidAppointments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="text-xl">💳</span>
              <h4 className="font-extrabold text-sm">
                Pending Client Invoices ({unpaidAppointments.length})
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-800">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unpaidAppointments.map((apt) => {
              const aptPets = pets.filter((p) => apt.petIds.includes(p.id));
              return (
                <div
                  key={apt.id}
                  className="bg-white p-3.5 rounded-2xl border border-amber-200/80 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <p className="font-bold text-xs text-stone-900">
                      {aptPets.map((p) => p.name).join(' & ')} • {apt.serviceType.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Completed on {apt.date} • ${apt.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(apt)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-sm"
                  >
                    Pay Invoice
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-stone-900">
              {t.completed_transactions}
            </h3>
            <p className="text-xs text-stone-500">
              Bank payouts and encrypted client credit card settlements.
            </p>
          </div>

          <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
            {transactions.length} Total Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3">Receipt #</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Service Fee</th>
                <th className="pb-3">Tip</th>
                <th className="pb-3">Total Paid</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 font-mono font-bold text-stone-800">
                    {tx.receiptNumber}
                  </td>
                  <td className="py-3 text-stone-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 capitalize text-stone-700 font-medium">
                    {tx.paymentMethod === 'apple_pay'
                      ? ' Apple Pay'
                      : tx.paymentMethod === 'google_pay'
                      ? 'Google Pay'
                      : `Card •••• ${tx.cardLast4 || '4242'}`}
                  </td>
                  <td className="py-3 font-mono text-stone-500">
                    ${tx.serviceFee.toFixed(2)}
                  </td>
                  <td className="py-3 font-mono text-emerald-600 font-bold">
                    +${tx.tipAmount.toFixed(2)}
                  </td>
                  <td className="py-3 font-mono font-extrabold text-stone-900 text-sm">
                    ${tx.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Settled
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setActiveReceipt(tx)}
                      className="text-stone-700 hover:text-amber-600 font-bold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrated Checkout Modal */}
      {showCheckoutModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-stone-900 tracking-tight flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Secure Client Checkout</span>
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Service & Pets Summary */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-stone-800">
                <span>{selectedAppointment.serviceType.replace('_', ' ').toUpperCase()}</span>
                <span className="font-mono">${selectedAppointment.price.toFixed(2)}</span>
              </div>
              <p className="text-stone-500">
                Date: {selectedAppointment.date} at {selectedAppointment.time}
              </p>
            </div>

            {/* Tip Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center justify-between">
                <span>{t.tip_walker}</span>
                <span className="text-emerald-600 font-mono font-bold">+${calculateTipAmount().toFixed(2)}</span>
              </label>

              <div className="grid grid-cols-4 gap-2 text-xs">
                {[15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setTipPercent(pct);
                      setCustomTip('');
                    }}
                    className={`py-2 rounded-xl font-bold border transition ${
                      tipPercent === pct && customTip === ''
                        ? 'bg-amber-500 text-stone-950 border-amber-500'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setTipPercent(0);
                    setCustomTip('10');
                  }}
                  className={`py-2 rounded-xl font-bold border transition ${
                    customTip !== ''
                      ? 'bg-amber-500 text-stone-950 border-amber-500'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50 text-stone-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold ${
                    paymentMethod === 'apple_pay'
                      ? 'border-amber-500 bg-amber-50 text-stone-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <span></span>
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold ${
                    paymentMethod === 'google_pay'
                      ? 'border-amber-500 bg-amber-50 text-stone-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>G-Pay</span>
                </button>
              </div>
            </div>

            {/* Credit Card inputs if card selected */}
            {paymentMethod === 'card' && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">{t.card_number}</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">MM/YY</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Itemized Total */}
            <div className="p-3.5 rounded-2xl bg-stone-900 text-white flex items-center justify-between text-xs">
              <div>
                <p className="text-stone-400">Total Charged</p>
                <p className="text-xl font-black font-mono text-amber-400">
                  ${(selectedAppointment.price + calculateTipAmount()).toFixed(2)}
                </p>
              </div>

              <div className="text-right text-[11px] text-stone-400">
                <p>256-bit TLS Encrypted</p>
                <p className="text-emerald-400 font-bold">Zero Fraud Guarantee</p>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Authorize ${(selectedAppointment.price + calculateTipAmount()).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-stone-900">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                <div>
                  <h3 className="font-black text-lg">PawRoute</h3>
                  <p className="text-[10px] text-stone-500 font-mono">OFFICIAL VISIT RECEIPT</p>
                </div>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">Receipt No:</span>
                <span className="font-bold">{activeReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Timestamp:</span>
                <span>{new Date(activeReceipt.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Channel:</span>
                <span className="capitalize">{activeReceipt.paymentMethod.replace('_', ' ')}</span>
              </div>

              <div className="border-t border-dashed my-3 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Base Walk Service:</span>
                  <span>${activeReceipt.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Walker Appreciation Tip:</span>
                  <span>+${activeReceipt.tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Platform Processing (Card/TLS):</span>
                  <span>${activeReceipt.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold border-t pt-2 text-stone-900">
                  <span>Grand Total Paid:</span>
                  <span>${activeReceipt.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl text-center text-[11px] text-stone-500">
              Thank you for trusting PawRoute! Both you and your pet made our day brighter.
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-800"
            >
              <Download className="w-4 h-4" />
              <span>Print or Save PDF Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
