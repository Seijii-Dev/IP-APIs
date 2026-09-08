#!/usr/bin/env bash

VERSION="0.6.2"
BUILD_DATE="2026"
AUTHOR="seijixinghe"

function banner() {

  echo -e "${COLOR_BOLD_CYAN}
             █████╗ ██╗  ██╗██╗ ██████╗ ███╗   ███╗
            ██╔══██╗╚██╗██╔╝██║██╔═══██╗████╗ ████║
            ███████║ ╚███╔╝ ██║██║   ██║██╔████╔██║
            ██╔══██║ ██╔██╗ ██║██║   ██║██║╚██╔╝██║
            ██║  ██║██╔╝ ██╗██║╚██████╔╝██║ ╚═╝ ██║
            ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝${COLOR_RESET}
"
  echo -e "${COLOR_BOLD_MAGENTA}$(printf '=%.0s' {1..66})${COLOR_RESET}"
  echo -e "${COLOR_SUCCESS}🚀 Version    : ${COLOR_LIGHT_CYAN}${VERSION}${COLOR_RESET}"
  echo -e "${COLOR_SUCCESS}📅 Build Date : ${COLOR_LIGHT_CYAN}${BUILD_DATE}${COLOR_RESET}"
  echo -e "${COLOR_SUCCESS}⚙️  Author     : ${COLOR_LIGHT_CYAN}${AUTHOR}${COLOR_RESET}"
  echo -e "${COLOR_BOLD_MAGENTA}$(printf '=%.0s' {1..66})${COLOR_RESET}"
  echo ""
}
