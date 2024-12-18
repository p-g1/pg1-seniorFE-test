interface GenerateBitcoinUriParams {
  address: string;
  amount: string;
  message?: string;
};

export default function generateBitcoinUri({
  address,
  amount,
  message
}: GenerateBitcoinUriParams): string {
  const formattedAmount = parseFloat(amount).toFixed(8);
  const baseUri = `bitcoin:${address}`;
  const params = new URLSearchParams();
  
  if (amount) params.append('amount', formattedAmount);
  if (message) params.append('message', message);

  return `${baseUri}?${params.toString()}`;
};