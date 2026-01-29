function Footer() {
  return (
    <>
      <div className="w-full py-8 bg-foreground text-sm text-card shrink-0">
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col justify-around gap-1">
          <div className="text-lg">MoiMo</div>
          <div className="text-xs text-card/80">
            당신의 관심사로 시작하는 새로운 만남
          </div>
          <div className="text-xs text-card/80">
            © 2025 MoiMo. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
