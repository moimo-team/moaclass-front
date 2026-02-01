import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className="w-full py-8 bg-foreground text-sm text-card shrink-0">
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 flex flex-col justify-around gap-1">
          <div className="text-lg">MoaCle</div>
          <div className="text-xs text-card/80">
            모아클: 당신의 취미, 우리의 연결.
          </div>
          <div className="text-xs text-card/80 flex items-center gap-2">
            © 2026 MoaCle. All rights reserved.
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
