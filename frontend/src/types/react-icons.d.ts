import * as React from 'react';

declare module 'react-icons/ai' {
  type IconProps = React.SVGProps<SVGSVGElement> & { size?: string | number };
  export const AiOutlineEye: React.ComponentType<IconProps>;
  export const AiOutlineEyeInvisible: React.ComponentType<IconProps>;
}

declare module 'react-icons/fa' {
  type IconProps = React.SVGProps<SVGSVGElement> & { size?: string | number };
  export const FaArrowUp: React.ComponentType<IconProps>;
}

declare module 'react-icons/ri' {
  type IconProps = React.SVGProps<SVGSVGElement> & { size?: string | number };
  export const RiSidebarFoldLine: React.ComponentType<IconProps>;
  export const RiSidebarUnfoldLine: React.ComponentType<IconProps>;
}

declare module 'react-icons/md' {
  type IconProps = React.SVGProps<SVGSVGElement> & { size?: string | number };
  export const MdAttachFile: React.ComponentType<IconProps>;
}
