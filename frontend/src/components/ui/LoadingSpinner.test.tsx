import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner 컴포넌트', () => {
  it('기본 스피너가 렌더링됨', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('작은 크기(sm) 스피너가 렌더링됨', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-4', 'h-4');
  });

  it('중간 크기(md) 스피너가 렌더링됨', () => {
    const { container } = render(<LoadingSpinner size="md" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-8', 'h-8');
  });

  it('큰 크기(lg) 스피너가 렌더링됨', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-12', 'h-12');
  });

  it('텍스트가 표시됨', () => {
    render(<LoadingSpinner text="로딩 중..." />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('텍스트 없이 렌더링됨', () => {
    const { container } = render(<LoadingSpinner />);
    const text = container.querySelector('p');
    expect(text).not.toBeInTheDocument();
  });

  it('커스텀 className이 적용됨', () => {
    const { container } = render(<LoadingSpinner className="custom-spinner" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-spinner');
  });

  it('스피너가 초록색임', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-green-600');
  });

  it('플렉스 레이아웃이 적용됨', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });
});
