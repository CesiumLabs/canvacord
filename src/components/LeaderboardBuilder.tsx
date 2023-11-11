import { JSX, loadImage, StyleSheet } from '../helpers';
import { ImageSource } from '../helpers';
import { fixed } from '../helpers/utils';
import { Builder } from '../templates';

const DefaultColors = {
  Yellow: '#FFAA00',
  Blue: '#009BD6',
  Green: '#00D95F'
};

export interface LeaderboardProps {
  background: ImageSource | null;
  backgroundColor: string;
  header?: {
    title: string;
    subtitle: string;
    image: ImageSource;
  };
  players: {
    displayName: string;
    username: string;
    level: number;
    xp: number;
    rank: number;
    avatar: ImageSource;
  }[];
}

const Crown = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.5 17.5H3.5C3.225 17.5 3 17.7813 3 18.125V19.375C3 19.7188 3.225 20 3.5 20H16.5C16.775 20 17 19.7188 17 19.375V18.125C17 17.7813 16.775 17.5 16.5 17.5ZM18.5 5C17.6719 5 17 5.83984 17 6.875C17 7.15234 17.05 7.41016 17.1375 7.64844L14.875 9.34375C14.3937 9.70313 13.7719 9.5 13.4937 8.89063L10.9469 3.32031C11.2812 2.97656 11.5 2.46094 11.5 1.875C11.5 0.839844 10.8281 0 10 0C9.17188 0 8.5 0.839844 8.5 1.875C8.5 2.46094 8.71875 2.97656 9.05313 3.32031L6.50625 8.89063C6.22812 9.5 5.60312 9.70313 5.125 9.34375L2.86562 7.64844C2.95 7.41406 3.00312 7.15234 3.00312 6.875C3.00312 5.83984 2.33125 5 1.50312 5C0.675 5 0 5.83984 0 6.875C0 7.91016 0.671875 8.75 1.5 8.75C1.58125 8.75 1.6625 8.73438 1.74063 8.71875L4 16.25H16L18.2594 8.71875C18.3375 8.73438 18.4188 8.75 18.5 8.75C19.3281 8.75 20 7.91016 20 6.875C20 5.83984 19.3281 5 18.5 5Z"
        fill="#FFAA00"
      />
    </svg>
  );
};

const MAX_RENDER_HEIGHT = 1080;
const MIN_RENDER_HEIGHT = 1000;

export class LeaderboardBuilder extends Builder<LeaderboardProps> {
  public constructor() {
    super(500, MIN_RENDER_HEIGHT);

    this.bootstrap({
      background: null,
      backgroundColor: '#7c563c',
      players: []
    });

    this.setStyle({
      borderRadius: '1.5rem'
    });
  }

  public setBackground(background: ImageSource) {
    this.options.set('background', background);
    return this;
  }

  public setBackgroundColor(color: string) {
    this.options.set('backgroundColor', color);
    return this;
  }

  public setHeader(data: LeaderboardProps['header'] & {}) {
    this.options.set('header', data);
    return this;
  }

  public setPlayers(players: LeaderboardProps['players']) {
    const items = players.slice(0, 10);
    this.options.set('players', items);

    if (items.length <= 7) {
      this.height = MIN_RENDER_HEIGHT;
    } else if (items.length > 7) {
      this.height = MAX_RENDER_HEIGHT;
    }

    this.adjustCanvas();

    return this;
  }

  public async render() {
    const options = this.options.getOptions();

    let background, headerImg;

    if (options.background) {
      background = await loadImage(options.background);
    }

    if (options.header) {
      headerImg = await loadImage(options.header.image);
    }

    const winners = [options.players[1], options.players[0], options.players[2]].filter(Boolean);

    return (
      <div tw="h-full w-full flex relative">
        {background && <img src={background.toDataURL()} className="absolute top-0 left-0 h-full w-full" />}
        <div className="py-[30px] flex flex-col items-center w-full">
          {options.header && headerImg ? (
            <div tw="flex items-center justify-center flex-col w-full">
              <img src={headerImg.toDataURL()} tw="rounded-full w-16 h-w-16" />
              <h1 tw="text-white text-xl font-extrabold m-0 mt-2">{options.header.title}</h1>
              <h2 tw="text-white text-sm font-thin m-0">{options.header.subtitle}</h2>
            </div>
          ) : null}
          <div
            className={StyleSheet.cn(
              'flex flex-row w-[90%] justify-center items-center mt-16',
              winners.length ? 'mt-24' : ''
            )}
          >
            {await Promise.all(winners.map((winner) => this.renderTop(winner)))}
          </div>
          {this.renderPlayers(
            await Promise.all(options.players.filter((f) => !winners.includes(f)).map((m) => this.renderPlayer(m)))
          )}
        </div>
      </div>
    );
  }

  public renderPlayers(players: JSX.Element[]) {
    return <div className="mt-4 flex flex-col items-center justify-center w-[95%]">{players}</div>;
  }

  public async renderTop({ avatar, displayName, level, rank, username, xp }: LeaderboardProps['players'][number]) {
    const image = await loadImage(avatar);
    const currentColor = DefaultColors[rank === 1 ? 'Yellow' : rank === 2 ? 'Blue' : 'Green'];
    const crown = rank === 1;

    return (
      <div
        className={StyleSheet.cn(
          'relative flex flex-col items-center justify-center p-4 bg-[#1E2237CC] w-[35%] rounded-md',
          crown ? '-mt-4 bg-[#252A40CC] rounded-b-none h-[113%]' : '',
          rank === 2 ? 'rounded-br-none' : rank === 3 ? 'rounded-bl-none' : ''
        )}
      >
        {crown && (
          <div className="absolute flex -top-16">
            <Crown />
          </div>
        )}
        <div className="flex items-center justify-center flex-col absolute -top-10">
          <img
            src={image.toDataURL()}
            className={StyleSheet.cn(`border-[3px] border-[${currentColor}] rounded-full h-18 w-18`)}
          />
          <div
            className={`flex items-center justify-center text-xs p-2 text-center font-bold h-3 w-3 rounded-full text-white absolute bg-[${currentColor}] -bottom-[0.4rem]`}
          >
            {rank}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-5">
          <h1 tw="text-white text-base font-extrabold m-0">{displayName}</h1>
          <h2 tw="text-white text-xs font-thin m-0 mb-2">@{username}</h2>
          <h4 className={`text-sm text-[${currentColor}] m-0`}>Level {level}</h4>
          <h4 className={`text-sm text-[${currentColor}] m-0`}>{fixed(xp)} XP</h4>
        </div>
      </div>
    );
  }

  public async renderPlayer({ avatar, displayName, level, rank, username, xp }: LeaderboardProps['players'][number]) {
    const image = await loadImage(avatar);

    return (
      <div className="bg-[#252A40BB] p-4 rounded-md flex flex-row justify-between items-center w-full mb-2">
        <div className="flex flex-row">
          <div className="flex flex-col items-center justify-center mr-2">
            <h1 className="text-white font-extrabold text-xl m-0">{rank}</h1>
            <h4 className="text-white font-medium text-sm m-0">Rank</h4>
          </div>
          <img src={image.toDataURL()} className="rounded-full h-14 w-14 mr-2" />
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-white font-extrabold text-xl m-0">{displayName}</h1>
            <h4 className="text-white font-medium text-sm m-0">@{username}</h4>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h4 className="text-white font-medium text-sm m-0">Level {level}</h4>
          <h4 className="text-white font-medium text-sm m-0">{fixed(xp)} XP</h4>
        </div>
      </div>
    );
  }
}
