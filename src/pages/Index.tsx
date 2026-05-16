import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTimer } from '@/hooks/use-timer';
import { calcBreakDuration, formatTime } from '@/lib/timer';
import { Play, RotateCcw, Square } from 'lucide-react';

const Index = () => {
  const { status, isRunning, workTime, breakTime, startTimer, resetTimer } =
    useTimer();

  const getStateColor = () => {
    switch (status) {
      case 'working':
        return 'from-blue to-indigo';
      case 'breaking':
        return 'from-orange to-pink';
      default:
        return 'from-muted-foreground to-secondary';
    }
  };

  const getStateText = () => {
    switch (status) {
      case 'working':
        return 'Working...';
      case 'breaking':
        return isRunning ? 'Break Time' : `Break Ready`;
      default:
        return 'Ready to Focus';
    }
  };

  const getButtonText = () => {
    if (status === 'idle') return 'Start Work';
    if (status === 'working') return 'Finish Work';
    if (status === 'breaking') return 'Start Break';
    return 'Start';
  };

  const getButtonIcon = () => {
    if (status === 'working') return <Square className="w-5 h-5 mr-2" />;
    return <Play className="w-5 h-5 mr-2" />;
  };

  const displayTime =
    status === 'working' ? workTime : status === 'breaking' ? breakTime : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header with Theme Toggle */}
        <div className="text-center space-y-3 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl font-display font-medium bg-gradient-to-r from-blue via-indigo to-purple bg-clip-text text-transparent tracking-tight">
            Flowmodoro
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Work with your natural flow, break proportionally
          </p>
        </div>

        {/* Main Timer Card */}
        <Card className="p-8 text-center space-y-8 shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl ring-1 ring-black/5 dark:ring-white/10">
          {/* State Indicator */}
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getStateColor()} shadow-lg`}>
            {getStateText()}
          </div>

          {/* Timer Display */}
          <div className="space-y-6">
            <div className={`text-7xl font-mono font-bold tabular-nums transition-colors duration-700 ${
              status === 'working' ? 'text-blue dark:text-blue' :
              status === 'breaking' ? 'text-orange dark:text-orange' :
              'text-muted-foreground'
            }`}>
              {formatTime(displayTime)}
            </div>

            {status === 'working'  && (
              <div className="text-sm text-muted-foreground">
                Break will be: {formatTime(calcBreakDuration(workTime))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={startTimer}
              disabled={status === 'breaking' && isRunning}
              size="lg"
              className={`px-8 py-4 text-lg font-medium tracking-wide transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-lg ${
                status === 'working' ? 'bg-gradient-to-r from-blue to-indigo hover:shadow-blue/25 text-white' :
                status === 'breaking' ? 'bg-gradient-to-r from-orange to-pink hover:shadow-orange/25 text-white' :
                'bg-gradient-to-r from-blue to-indigo hover:shadow-blue/25 text-white'
              }`}
            >
              {getButtonIcon()}
              {getButtonText()}
            </Button>

            {(status !== 'idle' || workTime > 0) && (
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="px-6 py-4 transition-all duration-300 transform hover:scale-105 rounded-2xl border-2"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </Card>

        {/* Info Section */}
        <div className="text-center space-y-6 text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue/10 to-indigo/10 dark:from-blue/5 dark:to-indigo/5 backdrop-blur-sm border border-blue/20 dark:border-blue/10">
              <div className="font-semibold text-blue dark:text-blue mb-2 font-display">Work Flow</div>
              <div>Focus until natural fade</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange/10 to-pink/10 dark:from-orange/5 dark:to-pink/5 backdrop-blur-sm border border-orange/20 dark:border-orange/10">
              <div className="font-semibold text-orange dark:text-orange mb-2 font-display">Smart Break</div>
              <div>Work time ÷ 5</div>
            </div>
          </div>

          <p className="text-xs opacity-75 leading-relaxed max-w-sm mx-auto">
            Work as long as you can focus, then take a proportional break.
            This technique adapts to your natural rhythm for deeper productivity.
          </p>
        </div>
      </div>
    </div>
  );
};


export default Index;
