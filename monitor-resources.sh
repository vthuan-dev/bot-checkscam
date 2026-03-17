#!/bin/bash

echo "📊 VPS Resource Monitor"
echo "======================"

echo "💾 Memory Usage:"
free -h

echo ""
echo "💻 CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2 $4}'

echo ""
echo "🔄 Running Processes:"
pm2 list

echo ""
echo "📈 Memory by Process:"
ps aux --sort=-%mem | head -10

echo ""
echo "💡 Recommendations:"
USED_RAM=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
if (( $(echo "$USED_RAM > 80" | bc -l) )); then
    echo "⚠️  RAM usage high (${USED_RAM}%) - consider optimizing"
else
    echo "✅ RAM usage healthy (${USED_RAM}%)"
fi