import { Scrobbler2Page } from './app.po';

describe('scrobbler2 App', () => {
  let page: Scrobbler2Page;

  beforeEach(() => {
    page = new Scrobbler2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
