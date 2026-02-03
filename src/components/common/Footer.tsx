import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className="w-full py-8 bg-card text-sm text-card shrink-0 border-y border-primary">
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col justify-around gap-1">
          <div className="text-lg text-primary ">MoaClass</div>
          <div className="text-xs text-primary">
            '모여라! 아! 이거다 싶은 클래스!' 원데이클래스 프로젝트 '모아클'
          </div>
          <div className="text-xs text-primary flex flex-row gap-3">
            © 2026 Team-MoiMo. All rights reserved.
            <a
              href="https://github.com/moimo-team/moaclass-front"
              target="_blank"
              rel="noopener noreferrer"
              className="text-card hover:text-primary transition-colors"
            >
              <FaGithub size={18} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
