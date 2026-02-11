import React from 'react';

export const MapContainer = ({ children }) => <div>{children}</div>;
export const TileLayer = () => null;
export const Marker = ({ children }) => <div>{children}</div>;
export const Popup = ({ children }) => <div>{children}</div>;
export const useMap = () => ({
  setView: () => {},
  on: () => {},
  off: () => {},
});
export const useMapEvents = () => ({});
