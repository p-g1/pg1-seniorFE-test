"use client";

import { useState } from "react";
import PaymentForm from "@/components/PaymentForm";
import QRCodeGenerator from "@/components/QRCode";
import { FormData, Address } from '@/types/types';

interface WalletFormProps {
    address: Address;
};

export default function WalletForm({ address }: WalletFormProps) {
    const [formData, setFormData] = useState<FormData>();
    const [showQR, setShowQR] = useState(true);

    const handleFormSubmit = (data: FormData): void => {
        setFormData(data);
        setShowQR(true);
    };

    const handleClose = (): void => {
        setShowQR(false);
        setFormData(undefined);
    };

    return (
        <div className="space-y-6">
            <PaymentForm 
                address={address} 
                onSubmit={handleFormSubmit} 
            />

            {formData && address && showQR && (
                <QRCodeGenerator 
                    recipientAddress={address} 
                    amount={formData.amount}
                    message={formData.message}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};