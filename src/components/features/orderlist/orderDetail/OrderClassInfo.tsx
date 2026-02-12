interface OrderClassInfoProps {
  title: string;
  teacherName: string;
  price: number;
}

export const OrderClassInfo = ({
  title,
  teacherName,
  price,
}: OrderClassInfoProps) => {
  return (
    <div className="border border-[#4A5D4A] rounded-[16px] p-5 space-y-1">
      <h3 className="font-bold text-lg text-[#2D3A3A]">{title}</h3>
      <p className="text-muted-foreground">{teacherName}</p>
      <p className="text-[#2D3A3A] font-medium">{price.toLocaleString()}원</p>
    </div>
  );
};
