interface InfoItemProps {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center gap-2">
      {icon && <div className="text-gray-500">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export default InfoItem; 