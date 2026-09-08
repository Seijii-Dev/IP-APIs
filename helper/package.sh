#!/usr/bin/env bash

PACKAGES=(
  awesomeshot bat curl clang eza fzf git imagemagick
  inotify-tools lf mpd mpc neovim openssh
  neofetch termux-api tmux zsh
)

function packages() {

  setCursor off

  KB_DOWNLOAD_SIZE=0
  MB_DOWNLOAD_SIZE=0

  KB_INSTALLED_SIZE=0
  MB_INSTALLED_SIZE=0

  echo -e "‏‏‎‏‏‎ ‎ ‎‏‏‎  ‎📦 Getting Information Packages\n"

  printf "    %-19s %-11s %11s %11s\n" "Package Name" "Version" "Download" "Installed"

  for PACKAGE in "${PACKAGES[@]}"; do

    PACKAGE_NAME=$(apt show $PACKAGE 2> /dev/null | grep Package: | awk '{print $2}')
    PACKAGE_NAME=${PACKAGE_NAME:-$PACKAGE}
    VERSION=$(apt show $PACKAGE 2> /dev/null | grep Version: | awk '{print $2}')
    VERSION=${VERSION:-N/A}

    DOWNLOAD_SIZE=$(apt show $PACKAGE 2> /dev/null | grep Download-Size: | awk '{print $2}')
    INSTALLED_SIZE=$(apt show $PACKAGE 2> /dev/null | grep Installed-Size: | awk '{print $2}')

    UNIT_DOWNLOAD_SIZE=$(apt show $PACKAGE 2> /dev/null | grep Download-Size: | awk '{print $3}')
    UNIT_INSTALLED_SIZE=$(apt show $PACKAGE 2> /dev/null | grep Installed-Size: | awk '{print $3}')

    printf  "    -> ${COLOR_SUCCESS}%-16s${COLOR_BASED} ${COLOR_WARNING}%-10s${COLOR_BASED}  %6s %-3s  %6s %-3s\n" \
      "$PACKAGE_NAME" "$VERSION" "${DOWNLOAD_SIZE:-0}" "${UNIT_DOWNLOAD_SIZE:-kB}" "${INSTALLED_SIZE:-0}" "${UNIT_INSTALLED_SIZE:-kB}"

    if [[ "${UNIT_DOWNLOAD_SIZE}" == "kB" && "${UNIT_INSTALLED_SIZE}" == "MB" ]]; then

      KB_DOWNLOAD_SIZE=$(echo "${KB_DOWNLOAD_SIZE} + ${DOWNLOAD_SIZE} / 1024" | bc -l | xargs -i printf "%'.1f" {})
      MB_INSTALLED_SIZE=$(echo "${MB_INSTALLED_SIZE} + ${INSTALLED_SIZE}" | bc -l | xargs -i printf "%'.1f" {})

    elif [[ "${UNIT_DOWNLOAD_SIZE}" == "MB" && "${UNIT_INSTALLED_SIZE}" == "kB" ]]; then

      MB_DOWNLOAD_SIZE=$(echo "${MB_DOWNLOAD_SIZE} + ${DOWNLOAD_SIZE}" | bc -l | xargs -i printf "%'.1f" {})
      KB_INSTALLED_SIZE=$(echo "${KB_INSTALLED_SIZE} + ${INSTALLED_SIZE} / 1024" | bc -l | xargs -i printf "%'.1f" {})

    elif [[ "${UNIT_DOWNLOAD_SIZE}" == "kB" && "${UNIT_INSTALLED_SIZE}" == "kB" ]]; then

      KB_DOWNLOAD_SIZE=$(echo "${KB_DOWNLOAD_SIZE} + ${DOWNLOAD_SIZE} / 1024" | bc -l | xargs -i printf "%'.1f" {})
      KB_INSTALLED_SIZE=$(echo "${KB_INSTALLED_SIZE} + ${INSTALLED_SIZE} / 1024" | bc -l | xargs -i printf "%'.1f" {})

    elif [[ "${UNIT_DOWNLOAD_SIZE}" == "MB" && "${UNIT_INSTALLED_SIZE}" == "MB" ]]; then

      MB_DOWNLOAD_SIZE=$(echo "${MB_DOWNLOAD_SIZE} + ${DOWNLOAD_SIZE}" | bc -l | xargs -i printf "%'.1f" {})
      MB_INSTALLED_SIZE=$(echo "${MB_INSTALLED_SIZE} + ${INSTALLED_SIZE}" | bc -l | xargs -i printf "%'.1f" {})

    fi

  done

  TOTAL_DOWNLOAD_SIZE=$(echo "${KB_DOWNLOAD_SIZE} + ${MB_DOWNLOAD_SIZE}" | bc -l | xargs -i printf "%'.1f" {})
  TOTAL_INSTALLED_SIZE=$(echo "${KB_INSTALLED_SIZE} + ${MB_INSTALLED_SIZE}" | bc -l | xargs -i printf "%'.1f" {})

  printf    "\n    [ ${COLOR_WARNING}%s${COLOR_BASED} ]  ─────────────────────────────────> ${COLOR_WARNING}%s${COLOR_BASED} %s      ${COLOR_WARNING}%s${COLOR_BASED} %s\n" "TOTAL" ${TOTAL_DOWNLOAD_SIZE} "MB" ${TOTAL_INSTALLED_SIZE} "MB"

  echo ""

}

function installPackages() {

  setCursor off

  echo -e "\n‏‏‎‏‏‎ ‎ ‎‏‏‎  ‎📦 Downloading Packages\n"

  for PACKAGE in "${PACKAGES[@]}"; do

    start_animation "       Installing ${COLOR_WARNING}'${COLOR_SUCCESS}${PACKAGE}${COLOR_WARNING}'${COLOR_BASED} ..."

    pkg i -y $PACKAGE &>/dev/null
    THIS_PACKAGE=$(pkg list-installed $PACKAGE 2> /dev/null | tail -n 1)
    CHECK_PACKAGE=${THIS_PACKAGE%/*}

    if [[ $CHECK_PACKAGE == $PACKAGE ]]; then

      stop_animation $? || exit 1

    else

      stop_animation $?

    fi

  done

  setCursor on

}
