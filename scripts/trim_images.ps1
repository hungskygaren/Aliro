Add-Type -AssemblyName System.Drawing

function Trim-TransparentImage {
    param (
        [string]$Path,
        [string]$OutPath
    )

    $bmp = [System.Drawing.Bitmap]::FromFile($Path)
    $minX = $bmp.Width
    $minY = $bmp.Height
    $maxX = 0
    $maxY = 0

    for ($y = 0; $y -lt $bmp.Height; $y++) {
        for ($x = 0; $x -lt $bmp.Width; $x++) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.A -gt 10) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $width = $maxX - $minX + 1
    $height = $maxY - $minY + 1

    Write-Host "File: $Path"
    Write-Host "Original: $($bmp.Width) x $($bmp.Height)"
    Write-Host "Cropped: $width x $height (X: $minX, Y: $minY)"

    $rect = New-Object System.Drawing.Rectangle($minX, $minY, $width, $height)
    $croppedBmp = $bmp.Clone($rect, $bmp.PixelFormat)
    $bmp.Dispose()

    $croppedBmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $croppedBmp.Dispose()
}

Trim-TransparentImage -Path "assets/market-intelligence/sec-5-starts-with.png" -OutPath "assets/market-intelligence/sec-5-starts-with.png"
Trim-TransparentImage -Path "assets/market-intelligence/sec-5-feeds-into.png" -OutPath "assets/market-intelligence/sec-5-feeds-into.png"
