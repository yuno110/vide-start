import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button 컴포넌트', () => {
  it('기본 버튼이 렌더링됨', () => {
    render(<Button>클릭</Button>);
    const button = screen.getByRole('button', { name: '클릭' });
    expect(button).toBeInTheDocument();
  });

  it('primary variant 스타일이 적용됨', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-600');
  });

  it('secondary variant 스타일이 적용됨', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('outline variant 스타일이 적용됨', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'border-green-600');
  });

  it('danger variant 스타일이 적용됨', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('작은 크기(sm) 스타일이 적용됨', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('중간 크기(md) 스타일이 적용됨', () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('큰 크기(lg) 스타일이 적용됨', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('fullWidth 속성이 적용됨', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('클릭 이벤트가 정상 동작함', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서 클릭이 동작하지 않음', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>비활성화</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('로딩 상태에서 "Loading..." 텍스트가 표시됨', () => {
    render(<Button isLoading>제출</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('제출')).not.toBeInTheDocument();
  });

  it('로딩 상태에서 버튼이 비활성화됨', () => {
    render(<Button isLoading>제출</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('로딩 상태에서 스피너 아이콘이 표시됨', () => {
    render(<Button isLoading>제출</Button>);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('커스텀 className이 적용됨', () => {
    render(<Button className="custom-class">커스텀</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
