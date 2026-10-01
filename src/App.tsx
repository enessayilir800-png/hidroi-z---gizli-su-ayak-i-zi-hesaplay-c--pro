/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MobileFrame } from './components/MobileFrame';
import { MobileStatusBar } from './components/MobileStatusBar';
import { TopHeader } from './components/TopHeader';
import { BottomNav, NavTab } from './components/BottomNav';
import { PhotoScannerView } from './components/PhotoScannerView';
import { DailyBasketView } from './components/DailyBasketView';
import { CompareView } from './components/CompareView';
import { BasketItem, WaterItem } from './types/water';
import { WATER_DATABASE } from './data/waterFootprintData';

const STORAGE_KEY = 'hidroiz_user_basket_v3';

function AppContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('photo');
  // Default to false so Web users enjoy the full responsive desktop experience
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);

  // Initialize with clean default items
  const [basket, setBasket] = useState<BasketItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    const defaultCoffee = WATER_DATABASE.find(i => i.id === 'coffee-cup');
    const defaultJeans = WATER_DATABASE.find(i => i.id === 'jeans');

    const initial: BasketItem[] = [];
    if (defaultCoffee) initial.push({ item: defaultCoffee, quantity: 1, addedAt: Date.now() });
    if (defaultJeans) initial.push({ item: defaultJeans, quantity: 1, addedAt: Date.now() + 1 });
    return initial;
  });

  // Save basket to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    } catch {
      // ignore
    }
  }, [basket]);

  const totalBasketLiters = basket.reduce(
    (acc, curr) => acc + curr.item.totalLiters * curr.quantity,
    0
  );

  const handleAddToBasket = (item: WaterItem, qty: number = 1) => {
    setBasket((prev) => {
      const existingIdx = prev.findIndex((b) => b.item.id === item.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + qty,
        };
        return copy;
      }
      return [...prev, { item, quantity: qty, addedAt: Date.now() }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setBasket((prev) =>
      prev.map((b) => (b.item.id === itemId ? { ...b, quantity: newQty } : b))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setBasket((prev) => prev.filter((b) => b.item.id !== itemId));
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  return (
    <MobileFrame isDeviceFrame={isDeviceFrame}>
      {/* Show fake status bar ONLY if user chooses the mobile phone preview frame */}
      {isDeviceFrame && <MobileStatusBar />}

      {/* Responsive Header for Web & Mobile */}
      <TopHeader
        totalBasketLiters={totalBasketLiters}
        basketCount={basket.length}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenBasket={() => setActiveTab('basket')}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame((prev) => !prev)}
      />

      {/* Main View Area */}
      <main className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-200 ${
        isDark ? 'bg-[#0A1122]' : 'bg-[#F8FAFC]'
      }`}>
        {activeTab === 'photo' && (
          <PhotoScannerView
            onAddToBasket={handleAddToBasket}
            onOpenBasket={() => setActiveTab('basket')}
          />
        )}

        {activeTab === 'basket' && (
          <DailyBasketView
            basket={basket}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearBasket={handleClearBasket}
            onGoToScanner={() => setActiveTab('photo')}
          />
        )}

        {activeTab === 'compare' && <CompareView />}
      </main>

      {/* Bottom Navigation for Mobile (hidden on desktop md+ screens) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        basketCount={basket.length}
      />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
